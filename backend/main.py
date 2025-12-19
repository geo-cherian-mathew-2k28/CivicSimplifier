import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Stable Imports for LangChain 0.1.x
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.llms import Ollama
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploaded_docs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
DB_DIR = "db"

qa_chain = None
llm = Ollama(model="llama3.2:1b")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

class QuestionRequest(BaseModel):
    question: str

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    global qa_chain
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = text_splitter.split_documents(documents)
    
    vectordb = Chroma.from_documents(
        documents=texts, 
        embedding=embeddings,
        persist_directory=DB_DIR
    )
    
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectordb.as_retriever(search_kwargs={"k": 3}),
        return_source_documents=True
    )
    
    return {"status": "success", "message": "Document processed! Ask me anything."}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    global qa_chain
    
    # 1. Save the file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 2. Load PDF
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    
    # --- SAFETY CHECK 1: Did we load anything? ---
    if not documents:
        raise HTTPException(status_code=400, detail="The PDF appears to be empty.")

    # 3. Split Text
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = text_splitter.split_documents(documents)
    
    # --- SAFETY CHECK 2: Is there actual text? ---
    # If the PDF is a scanned image, 'texts' will be empty.
    if not texts:
        raise HTTPException(status_code=400, detail="No text found! This might be a scanned image. Please use a text-based PDF.")

    # 4. Create Vector Store
    # We delete the old DB to keep it fresh for the demo
    if os.path.exists(DB_DIR):
        shutil.rmtree(DB_DIR)

    vectordb = Chroma.from_documents(
        documents=texts, 
        embedding=embeddings,
        persist_directory=DB_DIR
    )
    
    # 5. Create Chain
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectordb.as_retriever(search_kwargs={"k": 3}),
        return_source_documents=True
    )
    
    return {"status": "success", "message": "Document processed! Ask me anything."}