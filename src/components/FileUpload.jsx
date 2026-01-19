import React, { useRef, useState } from 'react';
import { Upload, X, File as FileIcon } from 'lucide-react';
import Button from './Button';

const FileUpload = ({ onFileSelect }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (selectedFile) => {
        setFile(selectedFile);
        onFileSelect(selectedFile);
    };

    const clearFile = () => {
        setFile(null);
        onFileSelect(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="w-full">
            {!file ? (
                <div
                    className={`relative h-64 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center
            ${dragActive
                            ? 'border-emerald-500 bg-emerald-500/5'
                            : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-emerald-400'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleChange}
                        accept="image/*,.dcm"
                    />
                    <div className="p-4 bg-emerald-500/10 rounded-full mb-4">
                        <Upload className="text-emerald-500" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Drag and drop your X-ray image</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Supports PNG, JPG, DICOM</p>
                    <Button variant="outline" className="pointer-events-none">Browse Files</Button>
                </div>
            ) : (
                <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <FileIcon className="text-blue-500" size={24} />
                        </div>
                        <div>
                            <p className="font-semibold text-sm truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button onClick={clearFile} className="p-2 hover:bg-red-500/10 rounded-full text-gray-500 hover:text-red-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
