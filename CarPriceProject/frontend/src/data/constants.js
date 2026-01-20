// src/data/constants.js
import { DollarSign, LayoutDashboard, History, Upload, MessageSquare } from 'lucide-react';

/**
 * Dữ liệu tĩnh cho Form nhập liệu.
 * Dùng để giới hạn lựa chọn của người dùng, tránh nhập liệu sai.
 */
export const MANUFACTURERS = [
    'Ford', 'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi',
    'Toyota', 'Honda', 'Hyundai', 'Kia', 'Skoda'
];

export const MODELS = {
    'Ford': ['Fiesta', 'Focus', 'Kuga', 'Mustang', 'Puma'],
    'Volkswagen': ['Golf', 'Polo', 'Tiguan', 'Passat', 'T-Roc'],
    'BMW': ['1 Series', '2 Series', '3 Series', '5 Series', 'X3', 'X5'],
    'Mercedes-Benz': ['A Class', 'C Class', 'E Class', 'GLC', 'GLA Class'],
    'Audi': ['A1', 'A3', 'A4', 'Q3', 'Q5', 'Q2'],
    'Toyota': ['Yaris', 'Corolla', 'Camry', 'RAV4', 'Aygo'],
    'Honda': ['Civic', 'CR-V', 'Jazz'],
    'Hyundai': ['i10', 'i20', 'i30', 'Tucson', 'Santa Fe'],
    'Kia': ['Picanto', 'Rio', 'Sportage', 'Sorento'],
    'Skoda': ['Fabia', 'Octavia', 'Superb', 'Karoq', 'Kodiaq']
};

export const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Other'];
export const TRANSMISSIONS = ['Manual', 'Automatic', 'Semi-Auto'];
export const YEARS = Array.from({ length: 55 }, (_, i) => new Date().getFullYear() + 1 - i); // Tạo danh sách năm từ 1970 đến hiện tại + 1

/**
 * Cấu hình Tỷ giá & Định dạng tiền tệ.
 */
export const EXCHANGE_RATES = {
    'USD': { rate: 1, symbol: '$', locale: 'en-US' },
    'VND': { rate: 25450, symbol: '₫', locale: 'vi-VN' },
    'EUR': { rate: 0.92, symbol: '€', locale: 'de-DE' },
    'GBP': { rate: 0.79, symbol: '£', locale: 'en-GB' },
};

/**
 * Cấu hình các Tab điều hướng.
 * Dùng để render Navbar động.
 */
export const TABS = [
    { id: 'valuation', labelKey: 'valuation', icon: DollarSign },
    { id: 'batch', labelKey: 'batch', icon: Upload },
    { id: 'chat', labelKey: 'chat', icon: MessageSquare },
    { id: 'analysis', labelKey: 'analysis', icon: LayoutDashboard },
    { id: 'history', labelKey: 'history', icon: History },
];

/**
 * Dữ liệu đa ngôn ngữ (Internationalization - i18n).
 * Toàn bộ text trên giao diện sẽ lấy từ đây.
 */
export const TRANSLATIONS = {
    vi: {
        // Menu
        nav: {
            valuation: 'Định Giá',
            batch: 'Xử lý Lô',
            chat: 'Trợ lý AI',
            analysis: 'Phân Tích',
            history: 'Lịch sử'
        },
        // Tiêu đề chung
        title: 'AUTO PRESTIGE',
        subtitle: 'Định chuẩn giá trị xe hơi',
        // Form Định giá
        manufacturer: 'Hãng xe', model: 'Dòng xe', year: 'Năm SX',
        mileage: 'Odo (Dặm)', transmission: 'Hộp số', fuelType: 'Nhiên liệu',
        tax: 'Thuế (£)', mpg: 'MPG', engineSize: 'Động cơ (L)',
        analyzeBtn: 'PHÂN TÍCH GIÁ TRỊ',
        ready: 'Sẵn sàng khởi động',
        readyDesc: 'Nhập thông số xe để kích hoạt hệ thống định giá AI.',
        analyzing: 'Đang tính toán...',
        analyzingDesc: 'Đang chạy mô hình CatBoost qua 1709 cây quyết định',
        error: 'Đã xảy ra lỗi kết nối',
        estimatedValue: 'GIÁ TRỊ THỊ TRƯỜNG',
        accuracy: 'Độ tin cậy 96.3%',
        locked: 'KẾT QUẢ ĐÃ CHỐT',
        reset: 'Định giá xe mới',
        lockedDesc: 'Màn hình đã bị khóa để bảo đảm tính toàn vẹn của kết quả.',
        // Trang Xử lý Lô
        batchTitle: 'Định giá hàng loạt',
        batchDesc: 'Tải lên file Excel (.xlsx) hoặc CSV để định giá nhiều xe cùng lúc.',
        uploadBtn: 'Chọn file dữ liệu',
        processing: 'Đang xử lý...',
        // Trang Trợ lý AI
        chatTitle: 'Trợ lý AI chuyên gia',
        chatDesc: 'Hỏi đáp về thị trường, so sánh giá và tra cứu dữ liệu thực tế.',
        chatPlaceholder: 'Ví dụ: Giá xe Ford Fiesta 2019 hiện nay bao nhiêu?',
    },
    en: {
        // Menu
        nav: {
            valuation: 'Valuation',
            batch: 'Batch',
            chat: 'AI Agent',
            analysis: 'Analysis',
            history: 'History'
        },
        // General
        title: 'AUTO PRESTIGE',
        subtitle: 'The Standard of Car Valuation',
        // Valuation Form
        manufacturer: 'Make', model: 'Model', year: 'Year',
        mileage: 'Mileage', transmission: 'Transmission', fuelType: 'Fuel',
        tax: 'Tax (£)', mpg: 'MPG', engineSize: 'Engine (L)',
        analyzeBtn: 'ANALYZE VALUE',
        ready: 'Ready to Start',
        readyDesc: 'Enter vehicle specs to activate AI valuation engine.',
        analyzing: 'Calculating...',
        analyzingDesc: 'Running CatBoost model through 1709 decision trees',
        error: 'Connection Error',
        estimatedValue: 'MARKET VALUE',
        accuracy: 'Confidence 96.3%',
        locked: 'RESULT LOCKED',
        reset: 'New Valuation',
        lockedDesc: 'Screen locked to ensure result integrity.',
        // Batch Page
        batchTitle: 'Batch Valuation',
        batchDesc: 'Upload Excel (.xlsx) or CSV files to value multiple cars at once.',
        uploadBtn: 'Select Data File',
        processing: 'Processing...',
        // Chat Page
        chatTitle: 'Expert AI Consultant',
        chatDesc: 'Ask about market trends, price comparison, and real-time data.',
        chatPlaceholder: 'Ex: What is the current market price for a 2019 Ford Fiesta?',
    }
};