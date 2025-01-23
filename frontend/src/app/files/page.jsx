"use client";
import { useState, useEffect } from "react";
import UploadedFilesList from "../../components/UploadedFilesList";

export default function Files() {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        // Mock fetching uploaded files
        setUploadedFiles([
            { id: 1, name: "example1.csv", size: 1234, url: "#" },
            { id: 2, name: "example2.csv", size: 4567, url: "#" },
        ]);
    }, []);

    const previewFile = (url) => {
        alert(`Previewing file from URL: ${url}`);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">File Management</h1>
            <UploadedFilesList files={uploadedFiles} onPreview={previewFile} />
        </div>
    );
}
