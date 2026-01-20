<div align="center">

# 🚘 AUTOPRESTIGE AI
### Decision Support System for Used Car Valuation

<p>
  <b>Hệ thống Hỗ trợ Quyết định Định giá Xe ô tô cũ Thông minh</b><br>
  <i>Minh bạch hóa thị trường xe cũ – Định giá chính xác – Giải thích tường tận</i>
</p>

<a href="https://www.python.org/">
  <img src="https://img.shields.io/badge/Backend-Python%20FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white">
</a>
<a href="https://reactjs.org/">
  <img src="https://img.shields.io/badge/Frontend-ReactJS-61DAFB?style=for-the-badge&logo=react&logoColor=black">
</a>
<a href="https://catboost.ai/">
  <img src="https://img.shields.io/badge/Model-CatBoost-FFCC00?style=for-the-badge&logo=python&logoColor=black">
</a>
<a href="#">
  <img src="https://img.shields.io/badge/XAI-SHAP-FF4B4B?style=for-the-badge">
</a>
<a href="#">
  <img src="https://img.shields.io/badge/Status-Completed-success?style=for-the-badge">
</a>

</div>

---

## 📖 Giới thiệu (Introduction)

**AUTOPRESTIGE AI** là sản phẩm thuộc bài tập lớn học phần **Hệ hỗ trợ quyết định (MI4216)** – Khoa Toán - Tin, **Đại học Bách Khoa Hà Nội**.

Trong bối cảnh thị trường xe đã qua sử dụng đầy biến động và thông tin bất cân xứng ("Thị trường quả chanh"), hệ thống này được xây dựng nhằm giải quyết bài toán **định giá công bằng** dựa trên dữ liệu.

Hệ thống sử dụng các thuật toán Học máy tiên tiến (SOTA) kết hợp với công nghệ Web hiện đại để cung cấp một giải pháp khép kín:
- 🚀 **Core Model:** Sử dụng **CatBoost** (Gradient Boosting) với độ chính xác $R^2 \approx 96.3\%$.
- 🔍 **Explainable AI:** Tích hợp **SHAP Values** để giải thích lý do đằng sau mức giá.
- 🤖 **AI Consultant:** Trợ lý ảo tích hợp **Gemini & LangChain** tư vấn thị trường.

---

## ✨ Tính năng nổi bật

- 🎯 **Định giá chính xác (Valuation):** Dự báo giá xe tức thì với sai số thấp (MAE < $1000).
- 💡 **Tính giải thích (Explainability):** Minh bạch hóa các yếu tố ảnh hưởng (Năm sản xuất, Odo, Hãng xe...) bằng biểu đồ trực quan.
- ⚡ **Xử lý lô (Batch Processing):** Hỗ trợ upload file Excel/CSV để định giá hàng loạt cho Showroom.
- 📊 **Dashboard phân tích:** Theo dõi xu hướng giá và thị phần hãng xe theo thời gian thực.
- 💬 **Trợ lý ảo AI:** Chatbot thông minh hỗ trợ tra cứu thông tin xe và tư vấn mua bán.

---

## 📂 Cấu trúc Repository

| Thư mục | Mô tả |
|------|------|
| **`📁 Report`** | 📄 Báo cáo chi tiết và Slide thuyết trình (`.pdf`) |
| **`📁 Data`** | 🗃️ Dữ liệu thô và dữ liệu đã tiền xử lý (`CarsData.csv`) |
| **`📁 CarPriceProject`** | 💻 **Mã nguồn chính của dự án** |
| &nbsp;&nbsp;&nbsp;&nbsp; `├── 📁 backend` | API Server (FastAPI), Model (`.cbm`), Logic xử lý |
| &nbsp;&nbsp;&nbsp;&nbsp; `├── 📁 frontend` | Giao diện người dùng (ReactJS + Vite + Tailwind) |

---

## 🏆 Hiệu năng Mô hình (Model Performance)

Dựa trên thực nghiệm so sánh 10 thuật toán khác nhau, **CatBoost** đã được chọn làm mô hình lõi nhờ khả năng xử lý biến phân loại vượt trội và tốc độ suy diễn nhanh.

| Model | $R^2$ Score | MAE ($) | RMSE | Đánh giá |
|-------|----------|---------|------|----------|
| Linear Regression | 0.7114 | 2,983 | 3,865 | Baseline |
| Random Forest | 0.9540 | 1,060 | 1,543 | Tốt |
| **CatBoost (Selected)** | **0.9631** | **979** | **1,383** | **Xuất sắc nhất** |

---

## 🚀 Cài đặt & Sử dụng

### Yêu cầu hệ thống
- **Python:** 3.9+
- **Node.js:** 16+

### 1️⃣ Khởi chạy Backend (FastAPI)
```bash
cd CarPriceProject/backend
# Tạo môi trường ảo (khuyến nghị)
python -m venv venv
venv\Scripts\activate

# Cài đặt thư viện
pip install -r requirements.txt

# Chạy Server
python main.py
# Server sẽ chạy tại: http://localhost:8000
```
### 2️⃣ Khởi chạy Frontend (ReactJS)
```bash
cd CarPriceProject/frontend
# Cài đặt packages
npm install

# Chạy ứng dụng
npm run dev
# App sẽ chạy tại: http://localhost:5173
```
### 🔑 Cấu hình biến môi trường (.env)
Tạo file .env trong thư mục backend để sử dụng tính năng Chatbot:
```bash
GEMINI_API_KEY="AIzaSy..."
```
---
## 👨‍💻 Thông tin tác giả

**NGUYỄN TRUNG KIÊN**\
Sinh viên K67 – Hệ thống thông tin (Khoa Toán - Tin)\
Đại học Bách Khoa Hà Nội\
🆔 MSSV: 20227180 \
📧 Email: kiennt.ethan@gmail.com \
💼 Lớp: 163653 (2025.1)

---
## 🎓 Lời cảm ơn
Em xin gửi lời cảm ơn chân thành đến **TS. Trần Ngọc Thăng** – Giảng viên hướng dẫn môn học Hệ hỗ trợ quyết định.
Những kiến thức và định hướng tư duy mà Thầy truyền đạt là nền tảng quan trọng giúp em hoàn thiện đồ án này, từ khâu phân tích dữ liệu, xây dựng mô hình đến việc đóng gói thành sản phẩm thực tế.

<div align="center"> <i>© 2026 AutoPrestige AI Project. All Rights Reserved.</i> </div>
