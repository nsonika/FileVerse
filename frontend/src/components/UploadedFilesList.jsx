export default function UploadedFilesList({ files, onPreview }) {
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
                            <button
                                onClick={() => onPreview(file.url)}
                                className="text-blue-500 hover:underline"
                            >
                                Preview
                            </button>
                            <a
                                href={file.url}
                                download={file.name}
                                className="text-green-500 hover:underline"
                            >
                                Download
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
