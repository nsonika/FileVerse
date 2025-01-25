"use client";

export default function UploadedFilesList({ files }) {
    const downloadFile = async (url, fileName) => {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Failed to fetch the file for download.");
            }

            // Convert the response into a Blob
            const blob = await response.blob();

            // Create a temporary download link
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            // Clean up the temporary link
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading file:", error);
            alert("Failed to download the file. Please try again.");
        }
    };

    return (
        <div className="mt-6">
            <h2 className="text-lg font-bold mb-4">Uploaded Files</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                    <div
                        key={file.id}
                        className="p-4 border rounded-lg shadow-sm bg-white"
                    >
                        <h3 className="font-semibold text-sm">{file.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">
                            Size: {(file.size / 1024).toFixed(2)} KB
                        </p>
                        <div className="flex justify-between">
                            {/* Open the file in a new tab */}
                            <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                Preview
                            </a>


                            {/* Force download the file */}
                            <button
                                onClick={() => downloadFile(file.url, file.name)}
                                className="text-green-500 hover:underline"
                            >
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
