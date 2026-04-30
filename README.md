# IgnisGuardian

<p align="left">
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-0F172A?style=for-the-badge&logo=tailwindcss" />
  <img alt="Express" src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img alt="Gemini API" src="https://img.shields.io/badge/Gemini_API-1A73E8?style=for-the-badge&logo=google&logoColor=white" />
</p>

IgnisGuardian là ứng dụng web hỗ trợ xác thực người dùng bằng Firebase Authentication và tích hợp chatbot AI thông qua Gemini API.

## Tính năng chính

- Đăng ký và đăng nhập người dùng.
- Giao diện chính sau khi xác thực.
- Chatbot widget tương tác với backend Express.
- API chat sử dụng Gemini để phản hồi tiếng Việt ngắn gọn.

## Công nghệ sử dụng

- Frontend: React, Vite, Tailwind CSS, React Router, Firebase.
- Backend: Node.js, Express, CORS, dotenv, Google Generative AI SDK.
- Quản lý gói: npm.

## Cấu trúc thư mục

```text
IgnisGuardian/
|- ignisguardian/   # Frontend (React + Vite)
`- server/          # Backend API (Express + Gemini)
```

## Cài đặt và chạy dự án

### 1) Clone source code

```bash
git clone <repository-url>
cd IgnisGuardian
```

### 2) Cài đặt dependencies

```bash
cd ignisguardian
npm install
cd ../server
npm install
```

### 3) Cấu hình biến môi trường

Tạo file `server/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
```

Khuyến nghị: đưa thông tin Firebase về biến môi trường frontend (`VITE_*`) thay vì hard-code trong source.

### 4) Chạy backend

```bash
cd server
npm run dev
```

### 5) Chạy frontend

```bash
cd ignisguardian
npm run dev
```

Frontend mặc định: `http://localhost:5173`  
Backend mặc định: `http://localhost:3001`

## API hiện có

- `GET /api/health`: Kiểm tra trạng thái server.
- `POST /api/chat`: Gửi message hoặc lịch sử chat để nhận phản hồi từ Gemini.

## Hướng mở rộng để sản phẩm hóa

- Tách cấu hình Firebase sang `.env`.
- Bổ sung error handling và logging cho backend.
- Thêm test cho luồng đăng nhập/đăng ký và API chat.
- Thiết lập CI để kiểm tra lint/build tự động.
