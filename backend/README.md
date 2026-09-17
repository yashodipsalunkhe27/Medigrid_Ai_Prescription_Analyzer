<p align="center">
  <h1 align="center">🏥 MediGrid AI</h1>
  <p align="center">AI-Powered Prescription Digitization & Medical Assistant</p>
</p>

# 🏥 MediGrid AI

MediGrid AI is an AI-powered FastAPI web application that converts handwritten medical prescriptions into structured digital insights, detects critical warnings, stores records in SQLite database, and provides an integrated medical AI assistant.
---

## 🚀 Features

- 📸 Upload handwritten prescription image
- 🤖 AI-based prescription data extraction
- ⚠️ Critical medical warnings detection
- 💾 Store extracted data in SQLite database
- 📍 Location-based pharmacy suggestions
- 💬 Integrated AI medical chat assistant
- 🌐 REST API built using FastAPI

## 🖥️ Tech Stack

- Backend: FastAPI
- AI Integration: Google Generative AI (Gemini)
- Database: SQLite3
- Frontend: HTML, CSS (Static)
- Server: Uvicorn
- Data Validation: Pydantic

## 📂 Project Structure

MediAI/
│── static/
│── fast_api_file.py
│── Extracting_prescription_data.py
│── Critical_Warinings.py
│── SQLLITE3_DataBase.py
│── AI_assistant_logic.py
│── MediGrid.db
│── requirements.txt
│── .env
│── README.md

## ⚙️ Installation

1️⃣ Clone the repository

git clone https://github.com/yourusername/MediGrid-AI.git

2️⃣ Navigate to project folder

cd MediAI

3️⃣ Create virtual environment

python -m venv venv

4️⃣ Activate environment

Windows:
venv\Scripts\activate

5️⃣ Install dependencies

pip install -r requirements.txt

6️⃣ Run FastAPI server

uvicorn fast_api_file:api --reload

## 🔐 Environment Variables

Create a `.env` file and add:

GEMINI_API_KEY=your_api_key_here

Make sure to load environment variables properly before running the server.


## 📡 API Endpoints

POST /data_extraction  
→ Extract prescription data from image

POST /critical_warnings  
→ Analyze critical medicine warnings

POST /post_into_db  
→ Save extracted data into SQLite database

GET /get_Saved_data  
→ Fetch stored prescription data

POST /chat  
→ Chat with AI medical assistant
---
## ⚠️ Disclaimer

This application is for educational and informational purposes only. 
It does not replace professional medical consultation.
---
## 👨‍💻 Author


## 📌 Usage

1. Enable location services
2. Upload prescription image
3. View extracted medicines
4. Find nearby pharmacies
5. Download digital report

Rohit Shinde  
AI & Backend Developer  

