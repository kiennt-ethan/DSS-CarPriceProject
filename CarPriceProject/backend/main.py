import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
import pandas as pd
import numpy as np
import joblib
from catboost import CatBoostRegressor, Pool
import os
import traceback
import logging
import io
import shap
import json
from datetime import datetime
from collections import Counter

# --- THƯ VIỆN AI & CHATBOT ---
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import initialize_agent, AgentType, Tool
from langchain_community.tools import DuckDuckGoSearchRun

# --- 1. CẤU HÌNH CƠ BẢN ---
# Load biến môi trường
load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_KEY")

# Cấu hình log
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AutoPrestige_Backend")

app = FastAPI(
    title="AutoPrestige AI System",
    description="Hệ thống định giá xe & Trợ lý ảo AI Real-time",
    version="3.0"
)

# Cấu hình CORS để Frontend (React) gọi được API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Trong môi trường Dev cho phép tất cả
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- CẤU HÌNH FILE LỊCH SỬ ---
HISTORY_FILE = "history_db.json"
# Hàm tiện ích: Load lịch sử
def load_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return []
# Hàm tiện ích: Lưu lịch sử
def save_history(record):
    history = load_history()
    # Thêm timestamp
    record['timestamp'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    record['id'] = len(history) + 1
    history.insert(0, record) # Mới nhất lên đầu
    
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=4)
# --- 2. KHỞI TẠO AI AGENT (GEMINI + INTERNET) ---
ai_agent_executor = None

if GEMINI_KEY:
    try:
        # 1. Khởi tạo LLM (Google Gemini Pro)
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=GEMINI_KEY,
            temperature=0.3, # Độ sáng tạo thấp để trả lời chính xác
            convert_system_message_to_human=True
        )
        
        # 2. Khởi tạo Công cụ Search (Internet Access - Miễn phí)
        search = DuckDuckGoSearchRun()
        
        tools = [
            Tool(
                name="Internet Search",
                func=search.run,
                description="Dùng khi cần tra cứu giá xe hiện tại, tin tức thị trường hoặc so sánh giá thực tế. Đầu vào là câu hỏi tìm kiếm."
            )
        ]
        
        # 3. Tạo Agent (Người đại diện)
        ai_agent_executor = initialize_agent(
            tools, 
            llm, 
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, 
            verbose=True,
            handle_parsing_errors=True
        )
        logger.info("✅ AI Agent (Gemini + Internet) đã sẵn sàng!")
        
    except Exception as e:
        logger.error(f"❌ Không thể khởi tạo AI Agent: {e}")
else:
    logger.warning("⚠️ Không tìm thấy GEMINI_KEY trong .env. Chức năng Chatbot sẽ bị tắt.")


# --- 3. LOAD MODEL CATBOOST & RESOURCES ---
MODEL_PATH = "catboost_final_model.cbm"
ENCODER_PATH = "encoders.pkl"

model = CatBoostRegressor()
encoders = {}
explainer = None

try:
    # Load Model CatBoost
    if os.path.exists(MODEL_PATH):
        model.load_model(MODEL_PATH)
        logger.info(f"✅ CatBoost Model loaded: {MODEL_PATH}")
        # Khởi tạo SHAP Explainer (để giải thích tại sao ra giá đó)
        try:
            explainer = shap.TreeExplainer(model)
            logger.info("✅ SHAP Explainer initialized.")
        except Exception as shap_err:
            logger.warning(f"⚠️ SHAP Error: {shap_err}")
    else:
        logger.critical(f"❌ Model missing: {MODEL_PATH}")

    # Load Encoders (Nếu có dùng LabelEncoding lúc train)
    if os.path.exists(ENCODER_PATH):
        encoders = joblib.load(ENCODER_PATH)
        logger.info(f"✅ Encoders loaded ({len(encoders)} encoders).")
except Exception as e:
    logger.error(f"❌ Resource Loading Error: {e}")

# --- 4. DATA MODELS (INPUT SCHEMAS) ---
class CarInput(BaseModel):
    manufacturer: str
    model: str
    year: int = Field(..., ge=1970, le=2026)
    transmission: str
    mileage: int = Field(..., ge=0)
    fuelType: str
    tax: float = Field(..., ge=0)
    mpg: float = Field(..., ge=0)
    engineSize: float = Field(..., ge=0)

    @validator('manufacturer', 'model', 'transmission', 'fuelType')
    def clean_strings(cls, v): 
        return str(v).strip()

class ChatInput(BaseModel):
    message: str

# --- 5. HÀM XỬ LÝ TRUNG TÂM (CORE LOGIC) ---
def preprocess_and_predict(input_df: pd.DataFrame, explain: bool = False):
    """
    Hàm xử lý chung cho cả Single Predict và Batch Predict.
    """
    try:
        # A. Feature Engineering (Tạo biến CarAge nếu chưa có)
        if 'CarAge' not in input_df.columns and 'year' in input_df.columns:
            input_df['CarAge'] = 2025 - input_df['year']
        
        # B. Encoding (Xử lý biến phân loại)
        # Map tên cột từ Frontend -> Tên cột trong Encoders/Model
        # Ví dụ: frontend gửi 'manufacturer', model cần 'Manufacturer' hoặc 'Manufacturer_Code'
        col_mapping = {
            'manufacturer': 'Manufacturer', 
            'Manufacturer': 'Manufacturer', 
            'model': 'model'
        }
        
        for input_col, encoder_key in col_mapping.items():
            if input_col in input_df.columns and encoder_key in encoders:
                encoder = encoders[encoder_key]
                
                # Hàm an toàn: Nếu gặp giá trị lạ chưa từng thấy -> gán 0
                def safe_transform(val):
                    val = str(val)
                    if val in encoder.classes_:
                        return encoder.transform([val])[0]
                    else:
                        return 0 
                
                # Tạo cột _Code mới
                target_col = f"{encoder_key}_Code"
                input_df[target_col] = input_df[input_col].apply(safe_transform)

        # C. Chuẩn bị DataFrame cuối cùng (Final Alignment)
        # Đảm bảo thứ tự cột đúng y hệt lúc train model
        required_features = model.feature_names_
        final_df = pd.DataFrame(index=input_df.index)

        for feature in required_features:
            if feature in input_df.columns:
                final_df[feature] = input_df[feature]
            elif '_' in feature: # Xử lý One-Hot Encoding động
                prefix = feature.split('_')[0]
                value = "_".join(feature.split('_')[1:])
                found = False
                for col in input_df.columns:
                    # So sánh không phân biệt hoa thường
                    if col.lower() == prefix.lower():
                        final_df[feature] = (input_df[col].astype(str) == value).astype(int)
                        found = True
                        break
                if not found: 
                    final_df[feature] = 0
            else:
                # Nếu thiếu cột số -> Điền 0
                final_df[feature] = 0 

        # D. Predict
        preds = model.predict(final_df)
        preds = np.maximum(preds, 0) # Giá xe không được âm

        # E. Giải thích (SHAP)
        shap_explanation = None
        if explain and explainer and len(final_df) == 1:
            try:
                shap_values = explainer.shap_values(final_df)
                vals = shap_values[0]
                # Lấy Top 3 đặc trưng ảnh hưởng nhất
                feature_importance = pd.DataFrame({
                    'feature': required_features,
                    'shap': vals,
                    'abs_shap': np.abs(vals)
                }).sort_values('abs_shap', ascending=False).head(3)
                
                shap_explanation = feature_importance[['feature', 'shap']].to_dict(orient='records')
            except Exception as e:
                logger.warning(f"SHAP calculation failed: {e}")

        return preds, shap_explanation

    except Exception as e:
        logger.error(f"Preprocessing failed: {e}")
        traceback.print_exc()
        raise e

# --- 6. API ENDPOINTS ---

@app.get("/")
def home():
    return {"status": "AutoPrestige Backend is Running 🚀"}

# API 1: Định giá đơn lẻ
@app.post("/predict")
def predict_single(data: CarInput):
    try:
        df_input = pd.DataFrame([data.dict()])
        # 1. Dự đoán
        price_pred, explanation = preprocess_and_predict(df_input, explain=True)
        final_price = round(price_pred[0], 2)

        # 2. LƯU VÀO LỊCH SỬ (NEW)
        history_record = data.dict()
        history_record['predicted_price'] = final_price
        history_record['explanation'] = explanation
        save_history(history_record) # <--- Lưu tại đây
        
        return {
            "price": final_price,
            "currency": "USD",
            "explanation": explanation
        }
    except Exception as e:
        logger.error(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dashboard-stats")
def get_dashboard_stats():
    history = load_history()
    if not history:
        return {"stats": [], "chart_data": [], "brands": [], "recent": []}

    total_predictions = len(history)
    total_value = sum(item['predicted_price'] for item in history)
    
    # 1. Tính toán thống kê theo Hãng (Cho biểu đồ tròn/cột)
    brands = [item['manufacturer'] for item in history]
    brand_counts = Counter(brands)
    brand_data = [
        {"name": k, "value": v, "color": "#" + "".join([hex(np.random.randint(0,255))[2:].zfill(2) for _ in range(3)])} 
        for k, v in brand_counts.most_common(5)
    ]

    # 2. Dữ liệu biểu đồ giá (Giả lập theo thời gian thực tế hoặc index)
    # Lấy 10 giao dịch gần nhất đảo ngược lại để vẽ biểu đồ
    recent_10 = history[:10][::-1] 
    chart_data = [{"name": f"#{item['id']}", "price": item['predicted_price']} for item in recent_10]

    return {
        "stats": [
            {"label": "Tổng lượt định giá", "value": str(total_predictions), "change": "+Realtime", "isPos": True, "icon": "Car", "color": "blue"},
            {"label": "Tổng giá trị", "value": f"${total_value:,.0f}", "change": "Market Cap", "isPos": True, "icon": "DollarSign", "color": "green"},
            {"label": "Hãng phổ biến nhất", "value": brand_counts.most_common(1)[0][0] if brands else "N/A", "change": "Top 1", "isPos": True, "icon": "Users", "color": "purple"},
        ],
        "brand_data": brand_data,
        "chart_data": chart_data,
        "recent": history[:5] # 5 giao dịch mới nhất
    }

@app.get("/history")
def get_full_history():
    return load_history()

# API 2: Định giá hàng loạt (Excel/CSV)
@app.post("/predict-batch")
async def predict_batch(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(400, "Chỉ hỗ trợ file .csv hoặc .xlsx")
            
        if df.empty:
            raise HTTPException(400, "File rỗng")
        
        # -----------------------------------------------------------
        # -- ĐÂY LÀ DÒNG CODE SỬA LỖI QUAN TRỌNG --
        # Chuẩn hóa tên cột về chữ thường để đồng nhất với Pydantic model
        df.columns = [col.lower() for col in df.columns]
        # -----------------------------------------------------------

        # 1. Dự đoán
        predictions, _ = preprocess_and_predict(df, explain=False)
        
        # 2. Gán kết quả
        df['predicted_price'] = np.round(predictions, 2)
        
        # 3. LƯU VÀO LỊCH SỬ (BATCH SAVE)
        records = df.to_dict(orient="records")
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        history = load_history()
        start_id = len(history) + 1
        
        new_history_items = []
        for i, item in enumerate(records):
            clean_item = {k: (v if pd.notna(v) else "") for k, v in item.items()}
            clean_item['id'] = start_id + i
            clean_item['timestamp'] = current_time
            clean_item['explanation'] = None
            new_history_items.append(clean_item)
            
        full_history = new_history_items + history
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(full_history, f, ensure_ascii=False, indent=4)

        return {"data": df.fillna("").to_dict(orient="records")}
    
    except Exception as e:
        logger.error(f"Batch Error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý file: {str(e)}")

# API 3: AI Chatbot (Gemini + Internet)
@app.post("/chat")
async def chat_agent(data: ChatInput):
    """
    Chatbot thông minh:
    - Nhận câu hỏi người dùng.
    - AI tự quyết định trả lời bằng kiến thức có sẵn hoặc tra Google (DuckDuckGo).
    """
    if not ai_agent_executor:
        return {"response": "Hệ thống AI chưa được cấu hình (Thiếu API Key). Vui lòng kiểm tra server."}
    
    try:
        # Prompt Engineering: Định hướng cho Gemini
        system_instruction = (
            "Bạn là chuyên gia định giá xe hơi của hệ thống AutoPrestige. "
            "Hãy trả lời ngắn gọn, thân thiện bằng tiếng Việt. "
            "Nếu người dùng hỏi về giá thị trường hiện tại, hãy DÙNG CÔNG CỤ 'Internet Search' để tìm thông tin mới nhất. "
            "Không được tự bịa ra giá nếu không tìm thấy. "
            f"Câu hỏi của khách hàng: {data.message}"
        )
        
        # Chạy Agent
        response = ai_agent_executor.run(system_instruction)
        return {"response": response}
    
    except Exception as e:
        logger.error(f"Chat Error: {e}")
        return {"response": f"Xin lỗi, tôi đang gặp sự cố khi suy nghĩ: {str(e)}"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)