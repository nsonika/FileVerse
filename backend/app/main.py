from fastapi import FastAPI, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from appwrite.client import Client
from appwrite.services.storage import Storage
from appwrite.services.databases import Databases
from dotenv import load_dotenv
from typing import Dict
import uuid
import os
import shutil
import time  # For timestamp
from appwrite.input_file import InputFile
from io import BytesIO

# Load environment variables
load_dotenv()

# Environment Variables
APPWRITE_ENDPOINT = os.getenv("APPWRITE_ENDPOINT")
APPWRITE_PROJECT_ID = os.getenv("APPWRITE_PROJECT_ID")
APPWRITE_API_KEY = os.getenv("APPWRITE_API_KEY")
APPWRITE_BUCKET_ID = os.getenv("APPWRITE_BUCKET_ID")
APPWRITE_DATABASE_ID = os.getenv("APPWRITE_DATABASE_ID")
APPWRITE_COLLECTION_ID = os.getenv("APPWRITE_COLLECTION_ID")

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Appwrite setup
client = Client()
client.set_endpoint(APPWRITE_ENDPOINT)
client.set_project(APPWRITE_PROJECT_ID)
client.set_key(APPWRITE_API_KEY)

storage = Storage(client)
database = Databases(client)

# In-memory storage for active sessions
active_sessions: Dict[str, Dict] = {}


@app.post("/upload/start")
async def start_upload(file_name: str, file_size: int):
    try:
        # Generate a unique upload ID
        upload_id = str(uuid.uuid4())
        chunk_size = 5 * 1024 * 1024  # 5 MB chunks

        # Create a document in Appwrite with the initial metadata
        database.create_document(
            database_id=APPWRITE_DATABASE_ID,
            collection_id=APPWRITE_COLLECTION_ID,
            document_id=upload_id,
            data={
                "file_name": file_name,
                "file_size": file_size,
                "file_id": upload_id,
                "created_at": int(time.time()),
            },
        )

        # Store the session details in memory
        active_sessions[upload_id] = {
            "file_name": file_name,
            "file_size": file_size,
            "uploaded_chunks": [],
        }

        # Debugging log
        print(f"Session Created: {upload_id}")
        print("Active Sessions:", active_sessions)

        return {"message": "Upload session started", "upload_id": upload_id, "chunk_size": chunk_size}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Update the upload_chunk endpoint
@app.post("/upload/chunk")
async def upload_chunk(upload_id: str = Query(...), chunk_index: int = Query(...), file: UploadFile = None):
    if upload_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Invalid upload session ID")

    try:
        session = active_sessions[upload_id]
        if "chunks" not in session:
            session["chunks"] = {}
        
        # Store chunk in memory
        chunk_data = await file.read()
        session["chunks"][chunk_index] = chunk_data
        session["uploaded_chunks"].append(chunk_index)

        print(f"Chunk Uploaded: {chunk_index} for Upload ID: {upload_id}")
        return {"message": "Chunk uploaded", "chunk_index": chunk_index}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def generate_file_url(file_id: str) -> str:
    return f"{APPWRITE_ENDPOINT}/storage/buckets/{APPWRITE_BUCKET_ID}/files/{file_id}/view?project={APPWRITE_PROJECT_ID}"


# Update the complete_upload endpoint
@app.post("/upload/complete")
async def complete_upload(upload_id: str):
    try:
        if upload_id not in active_sessions:
            raise HTTPException(status_code=404, detail="Invalid upload session ID")
        
        session = active_sessions[upload_id]
        file_name = session["file_name"]

        # Combine chunks in memory
        complete_file = BytesIO()
        for chunk_index in sorted(session["uploaded_chunks"]):
            complete_file.write(session["chunks"][chunk_index])
        
        complete_file.seek(0)
        
        # Upload to Appwrite
        input_file = InputFile.from_bytes(
            complete_file.read(),
            filename=file_name
        )
        
        uploaded_file = storage.create_file(
            bucket_id=APPWRITE_BUCKET_ID,
            file_id=upload_id,
            file=input_file
        )

        # Generate file URL and update database
        file_url = generate_file_url(upload_id)
        database.update_document(
            database_id=APPWRITE_DATABASE_ID,
            collection_id=APPWRITE_COLLECTION_ID,
            document_id=upload_id,
            data={"file_url": file_url}
        )

        # Cleanup session
        del active_sessions[upload_id]

        return {
            "message": "Upload complete", 
            "file_id": upload_id,
            "file_url": file_url
        }
        
    except Exception as e:
        print(f"Error uploading file to Appwrite: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/files")
async def list_files():
    try:
        files = database.list_documents(
            database_id=APPWRITE_DATABASE_ID,
            collection_id=APPWRITE_COLLECTION_ID,
        )
        
        # Add URLs to each file
        for file in files["documents"]:
            file["file_url"] = generate_file_url(file["file_id"])
            
        return {"files": files["documents"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
