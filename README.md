<div align="center">

# 🏛️ CivicSimplifier
### AI-Powered Legal Literacy for Everyone

![Status](https://img.shields.io/badge/Status-Active-success)
![AI](https://img.shields.io/badge/AI-Llama_3.2_1B-purple)
![Tech](https://img.shields.io/badge/Stack-React_|_FastAPI_|_RAG-blue)

<p align="center">
  <b>Simplify complex legal documents, rental agreements, and government schemes into plain English.</b><br>
  <i>100% Private. 100% Offline. Powered by Local AI.</i>
</p>

</div>

---

## 💡 The Problem
Legal documents are confusing. 60% of citizens struggle to understand rental agreements, insurance policies, or government notices. Legal advice is expensive, leaving many people vulnerable.

## 🚀 The Solution
**CivicSimplifier** is an intelligent document assistant.
* **Drag & Drop:** Upload any PDF.
* **Ask Questions:** "Can my landlord kick me out?" or "What is the deadline?"
* **Get Answers:** The AI reads the document and answers in simple, human language.

---

## 🛠️ Tech Stack (The "Mindblowing" Part)
We didn't just wrap ChatGPT. We built a full **RAG (Retrieval Augmented Generation)** pipeline running locally.

* **🧠 AI Engine:** Llama 3.2:1b (Running via Ollama)
* **🔌 Backend:** Python FastAPI (High-performance API)
* **📚 Memory:** ChromaDB (Vector Database for context)
* **🎨 Frontend:** React + Tailwind CSS (Glassmorphism UI)
* **🔒 Privacy:** No data leaves your computer.

---

## ⚡ How to Run This Project

### Prerequisite
1. Install [Ollama](https://ollama.com) and run: `ollama pull llama3.2:1b`
2. Install [Node.js](https://nodejs.org/) and [Python](https://python.org).

### 1. Clone the Repository
    git clone [https://github.com/geo-cherian-mathew-2k28/CivicSimplifier.git](https://github.com/geo-cherian-mathew-2k28/CivicSimplifier.git)
    cd CivicSimplifier

Start the Backend (Brain)
Open a terminal in the root folder:

    cd backend
    python -m venv venv
# Windows:
    venv\Scripts\activate
# Mac/Linux:
    source venv/bin/activate

    pip install -r requirements.txt
    python main.py

    Start the Frontend (UI)
Open a new terminal:

    cd frontend
    npm install
    npm run dev

    📸 Usage
Open the link shown in the frontend terminal (usually http://localhost:5173).

Upload a PDF document.

Chat with your document!

<div align="center"> <sub>Built with ❤️ by Geo Cherian Mathew</sub> </div>
