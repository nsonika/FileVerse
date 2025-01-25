"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DropZone from "../components/DropZone";
import FileUploader from "../components/FileUploader";

// Utility function to initialize upload progress
const initializeUploadProgress = (files) => {
  const progress = {};
  files.forEach((file) => {
    progress[file.name] = 0;
  });
  return progress;
};

// Function to start the upload session
const startUploadSession = async (file) => {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL
    }/upload/start?file_name=${encodeURIComponent(file.name)}&file_size=${
      file.size
    }`,
    { method: "POST" }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error from /upload/start:", errorData);
    throw new Error(`Failed to start upload for ${file.name}`);
  }

  return response.json();
};

// Function to upload a single chunk
const uploadChunk = async (uploadId, chunkIndex, chunk) => {
  const formData = new FormData();
  formData.append("file", chunk);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/chunk?upload_id=${uploadId}&chunk_index=${chunkIndex}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error uploading chunk:", errorData);
    throw new Error(`Failed to upload chunk ${chunkIndex}`);
  }
};

// Function to complete the upload
const completeUpload = async (uploadId) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/complete?upload_id=${uploadId}`,
    { method: "POST" }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error completing upload:", errorData);
    throw new Error(`Failed to complete upload.`);
  }

  return response.json();
};

export default function Home() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState({});
  const router = useRouter();

  const handleUpload = async () => {
    const updatedUploading = initializeUploadProgress(files);
    setUploading(updatedUploading);

    for (const file of files) {
      try {
        console.log(
          `Starting upload for file: ${file.name}, size: ${file.size}`
        );

        // Step 1: Start upload session
        const { upload_id, chunk_size } = await startUploadSession(file);
        console.log("Upload session started with ID:", upload_id);

        // Step 2: Upload chunks
        const totalChunks = Math.ceil(file.size / chunk_size);
        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
          const chunkStart = chunkIndex * chunk_size;
          const chunkEnd = Math.min(chunkStart + chunk_size, file.size);
          const chunk = file.slice(chunkStart, chunkEnd);

          await uploadChunk(upload_id, chunkIndex, chunk);

          console.log(
            `Chunk ${chunkIndex + 1}/${totalChunks} uploaded for ${file.name}`
          );
          setUploading((prev) => ({
            ...prev,
            [file.name]: Math.round(((chunkIndex + 1) / totalChunks) * 100),
          }));
        }

        // Step 3: Complete upload
        const { file_url } = await completeUpload(upload_id);
        console.log(`File uploaded successfully. File URL: ${file_url}`);
        alert(`Upload successful for ${file.name}! File URL: ${file_url}`);
      } catch (error) {
        console.error(`Upload failed: ${error.message}`);
        alert(`Failed to upload file: ${file.name}`);
      }
    }
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  const goToFiles = () => {
    router.push("/files");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl mx-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Upload Files</h1>
          <DropZone
            onFileSelect={(newFiles) => setFiles([...files, ...newFiles])}
          />
          <FileUploader
            files={files}
            uploading={uploading}
            onRemoveFile={removeFile}
          />
          <div className="flex justify-between mt-4">
            <button
              onClick={handleUpload}
              disabled={!files.length}
              className={`px-4 py-2 rounded border text-white bg-black ${
                !files.length && "opacity-50 cursor-not-allowed"
              }`}
            >
              Start Upload
            </button>
            <button
              onClick={goToFiles}
              className="px-4 py-2 rounded border border-black bg-white text-black"
            >
              Go to File Management
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
