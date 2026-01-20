# 🚗 Hệ thống Hỗ trợ Quyết định: Dự đoán Giá xe Ô tô (AutoPrestige AI)

Dự án bài tập lớn môn học Hệ Hỗ trợ Quyết định (MI4216) tại Đại học Bách khoa Hà Nội. Đây là một ứng dụng web Full-Stack, ứng dụng mô hình Machine Learning **CatBoost** để xây dựng hệ thống dự báo giá xe ô tô đã qua sử dụng, kết hợp **Trợ lý AI (Gemini)** có khả năng truy cập Internet để tư vấn và so sánh giá thị trường.

---

## 📸 Demo Giao diện

| Định giá Đơn lẻ (Có giải thích AI) | Trợ lý AI (Gemini + Internet) |
| :------------------------------: | :---------------------------: |
| ![Giao diện Định giá](https://github.com/kiennt-ethan/DSS-CarPriceProject/blob/main/frontend/anh/Dinh_Gia_Xong.png?raw=true) | ![Giao diện Chatbot](https://github.com/kiennt-ethan/DSS-CarPriceProject/blob/main/frontend/anh/ChatBot.png?raw=true) |

| Dashboard Phân tích | Xử lý Lô (Excel/CSV) |
| :------------------: | :--------------------: |
| ![Giao diện Dashboard](https://github.com/kiennt-ethan/DSS-CarPriceProject/blob/main/frontend/anh/Dashboard1.png?raw=true) | ![Giao diện Xử lý Lô](https://github.com/kiennt-ethan/DSS-CarPriceProject/blob/main/frontend/anh/Ket_Qua_Dinh_Gia_Hang_Loat.png?raw=true) |

---

## ✨ Tính năng nổi bật

-   **Định giá AI Chính xác cao:** Sử dụng mô hình **CatBoost** ($R^2 \approx 96.3\%$) để dự báo giá trị thị trường của xe.
-   **Giải thích AI (Explainable AI - XAI):** Tích hợp **SHAP** để giải thích tại sao mô hình đưa ra mức giá đó, tăng tính minh bạch.
-   **Trợ lý AI Thông minh:** Tích hợp **Google Gemini** và **LangChain**, cho phép Chatbot truy cập Internet (qua DuckDuckGo) để tra cứu giá thực tế và tư vấn cho người dùng.
-   **Xử lý Lô (Batch Processing):** Cho phép người dùng (VD: chủ showroom) upload file Excel/CSV để định giá hàng loạt xe cùng lúc.
-   **Dashboard Phân tích:** Trực quan hóa dữ liệu lịch sử, hiển thị các thống kê quan trọng và xu hướng thị trường real-time.
-   **Lịch sử Định giá:** Tự động lưu lại mọi lượt định giá và cho phép xuất báo cáo ra file Excel.
-   **Giao diện Hiện đại:**
    -   Hỗ trợ Chế độ Sáng/Tối (Light/Dark Mode).
    -   Hỗ trợ Đa ngôn ngữ (Tiếng Việt/Tiếng Anh).
    -   Hỗ trợ Đa tiền tệ (USD, VND, EUR, GBP) với tỷ giá tự động quy đổi.

---

## ⚙️ Ngăn xếp Công nghệ (Technology Stack)

| Lĩnh vực | Công nghệ |
| :------------- | :--------------------------------------------------------- |
| **Backend** | `Python`, `FastAPI`, `Uvicorn` |
| **Machine Learning** | `CatBoost`, `Scikit-learn`, `SHAP`, `Joblib`, `Pandas` |
| **AI Agent** | `LangChain`, `Google Gemini`, `DuckDuckGo Search` |
| **Frontend** | `React`, `Vite`, `Tailwind CSS`, `Framer Motion` |
| **Data Viz** | `Recharts` |

---

## 📂 Cấu trúc Thư mục

```
/
├── backend/
│   ├── main.py               # FastAPI server & API endpoints
│   ├── catboost_final_model.cbm  # Mô hình AI chính
│   ├── encoders.pkl          # Bộ mã hóa dữ liệu
│   ├── history_db.json       # Cơ sở dữ liệu lịch sử
│   ├── requirements.txt      # Thư viện Python
│   └── .env                  # Chứa API Key
│
└── frontend/
    ├── src/
    │   ├── components/       # Các components React (Dashboard, Chat...)
    │   ├── data/             # Dữ liệu tĩnh (Tỷ giá, Ngôn ngữ...)
    │   ├── App.jsx           # Component gốc của ứng dụng
    │   └── main.jsx          # Điểm khởi tạo React
    ├── public/
    │   └── car-bg.mp4        # Video nền
    ├── package.json          # Thư viện Javascript
    └── tailwind.config.js    # Cấu hình styling
```

---

## 🚀 Hướng dẫn Cài đặt và Khởi chạy

### Yêu cầu
-   [Python](https://www.python.org/downloads/) (phiên bản 3.9 trở lên)
-   [Node.js](https://nodejs.org/) (phiên bản 18 trở lên) và npm
-   [Git](https://git-scm.com/)

### 1. Clone Repository

```bash
git clone https://github.com/kiennt-ethan/DSS-CarPriceProject.git
cd DSS-CarPriceProject
```

### 2. Cài đặt Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# (Khuyên dùng) Tạo và kích hoạt môi trường ảo
python -m venv venv
# Trên Windows:
.\venv\Scripts\activate
# Trên macOS/Linux:
source venv/bin/activate

# Cài đặt các thư viện Python
pip install -r requirements.txt

# Tạo file .env và thêm key của bạn vào
echo GEMINI_KEY="AIzaSy...YOUR_KEY_HERE" > .env
```
**Quan trọng:** Thay thế `AIzaSy...YOUR_KEY_HERE` bằng **Google Gemini API Key** thật của bạn.

### 3. Cài đặt Frontend

```bash
# Di chuyển vào thư mục frontend
cd ../frontend

# Cài đặt các thư viện Javascript
npm install
```

### 4. Khởi chạy Ứng dụng

Bạn cần mở **2 terminal riêng biệt** để chạy song song Backend và Frontend.

**Terminal 1: Chạy Backend (từ thư mục `backend`)**
```bash
# Đảm bảo môi trường ảo đã được kích hoạt
uvicorn main:app --reload
```
🎉 Backend sẽ chạy tại `http://127.0.0.1:8000`.

**Terminal 2: Chạy Frontend (từ thư mục `frontend`)**
```bash
npm run dev
```
🎉 Frontend sẽ tự động mở trên trình duyệt tại `http://localhost:5173` (hoặc một port khác nếu 5173 đã bận).

---

## 👨‍💻 Tác giả

-   **Nguyễn Trung Kiên** - 20227180
-   **Trường:** Đại học Bách khoa Hà Nội
-   **Giảng viên hướng dẫn:** TS. Trần Ngọc Thăng