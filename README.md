# 🎥 Candidate Information Video Submission Portal

A MERN stack web application where candidates can submit their information, upload resumes (PDF), and record short video introductions directly through the browser.

---

## 🚀 Features
- ✍️ Candidate registration form with validation  
- 📄 Resume upload (max 5 MB)  
- 🎥 Video recording (max 90 seconds) using MediaRecorder API  
- 💾 Backend built with Node.js + Express + MongoDB  
- 🔐 Data securely stored and managed  
- 💻 Responsive frontend using React + Bootstrap  

---

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-------------|
| Frontend | React, Bootstrap |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| File Uploads | Multer, GridFS |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Vinit010/Candidate-Information-Video-Submission-Portal.git
cd Candidate-Information-Video-Submission-Portal
2️⃣ Install Dependencies
For backend
bash
Copy code
cd backend
npm install
For frontend
bash
Copy code
cd ../candidate-portal
npm install
3️⃣ Configure Environment Variables
Create a .env file inside the backend folder and add:

ini
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
4️⃣ Run the Application
Start backend:
bash
Copy code
cd backend
npm start
Start frontend:
bash<img width="1876" height="853" alt="Screenshot 2025-11-07 172731" src="https://github.com/user-attachments/assets/d0f974cc-a4ac-4f24-a6c6-5bbc3dc603b4" />

Copy code
cd ../candidate-portal
npm start

![Uploading Screenshot 2025-11-07 172731.png…]()
