"use client";
import { useState, useEffect } from "react";
import UploadedFilesList from "../../components/UploadedFilesList";

export default function Files() {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        // Fetch the uploaded files from the backend
        const fetchUploadedFiles = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/files`);
                if (!response.ok) {
                    throw new Error("Failed to fetch files from the server.");
                }
                const { files } = await response.json();
                setUploadedFiles(files.map(formatFileData));
            } catch (error) {
                console.error("Error fetching files:", error);
                alert("Failed to fetch files. Please try again later.");
            }
        };

        fetchUploadedFiles();
    }, []);

    // Helper function to format file data
    const formatFileData = (file) => ({
        id: file.file_id,
        name: file.file_name,
        size: file.file_size,
        url: file.file_url,
    });

    return (
        <div className="p-6 bg-gray-100 dark:text-black min-h-screen ">
            <h1 className="text-2xl font-bold mb-4">File Management</h1>
            <UploadedFilesList files={uploadedFiles} />
        </div>
    );
}
