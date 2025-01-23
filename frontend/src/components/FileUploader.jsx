export default function FileUploader({ files, uploading, onRemoveFile }) {
    return (
        <div className="mt-4">
            {files.map((file, index) => (
                <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between border-b py-2"
                >
                    <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                    </div>

                    <div className="flex items-center">
                        {uploading[file.name] && (
                            <div className="relative w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-blue-500"
                                    style={{
                                        width: `${uploading[file.name]}%`,
                                    }}
                                />
                            </div>
                        )}
                        <button
                            onClick={() => onRemoveFile(file)}
                            className="ml-4 text-red-500 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
