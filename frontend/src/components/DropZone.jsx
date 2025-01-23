"use client";
import { useState } from "react";

export default function DropZone({ onFileSelect }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        const validFiles = selectedFiles.filter(
            (file) =>
                file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")
        );

        if (selectedFiles.length !== validFiles.length) {
            alert("Only CSV files are allowed.");
        }
        onFileSelect(validFiles);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFileChange({ target: { files: droppedFiles } });
    };

    return (
        <div
            className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${isDragging ? "border-blue-500 bg-blue-100" : "border-gray-400"
                }`}
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
        >
            <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
                multiple
                accept=".csv"
            />
            <label
                htmlFor="fileInput"
                className="text-gray-600 cursor-pointer flex flex-col items-center"
            >
                <svg
                    className="w-12 h-12 text-gray-500 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                </svg>
                <span>Drop your CSV files here, or click to select</span>
            </label>
        </div>
    );
}
