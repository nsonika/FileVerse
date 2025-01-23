"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DropZone from "../components/DropZone";
import FileUploader from "../components/FileUploader";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState({});
  const router = useRouter();

  const handleUpload = () => {
    const updatedUploading = {};
    files.forEach((file) => {
      updatedUploading[file.name] = 0;
    });
    setUploading(updatedUploading);
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  const goToFiles = () => {
    router.push("/files");
  };

  return (
    <div>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Upload Files</h1>
        <DropZone
          onFileSelect={(newFiles) => setFiles([...files, ...newFiles])}
        />
        <FileUploader
          files={files}
          uploading={uploading}
          onRemoveFile={removeFile}
        />
        <button
          onClick={handleUpload}
          disabled={!files.length}
          className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded ${
            !files.length && "opacity-50 cursor-not-allowed"
          }`}
        >
          Start Upload
        </button>
        <button
          onClick={goToFiles}
          className="mt-4 ml-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Go to File Management
        </button>
      </div>
    </div>
  );
}
