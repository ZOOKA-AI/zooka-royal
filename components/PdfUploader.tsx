import React, { useState, useRef, DragEvent } from "react";
import { CloudArrowUpIcon, DocumentCheckIcon, XCircleIcon } from '@heroicons/react/24/solid';

export const PdfUploader: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File | undefined) => {
    setError(null);
    setFileName(null);

    if (!file) return;

    const isPdfByType = file.type === "application/pdf";
    const isPdfByName = file.name.toLowerCase().endsWith(".pdf");

    if (!isPdfByType && !isPdfByName) {
      setError("يُسمح فقط برفع ملفات PDF.");
      return;
    }

    setFileName(file.name);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0]);
    if(e.target) e.target.value = ""; // Allows re-uploading the same file
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const triggerFileBrowse = () => {
    fileInputRef.current?.click();
  };

  const resetState = () => {
    setFileName(null);
    setError(null);
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <input
        ref={fileInputRef}
        id="pdf-upload"
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {fileName && !error ? (
        <div className="bg-green-900/20 border border-green-700 p-4 rounded-lg flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <DocumentCheckIcon className="w-8 h-8 text-green-400" />
            <div>
              <p className="font-bold text-white">تم رفع الملف بنجاح</p>
              <p className="text-xs text-gray-300 font-mono">{fileName}</p>
            </div>
          </div>
          <button onClick={resetState} className="p-2 text-gray-400 hover:text-white">
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileBrowse}
          className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-blue-600 hover:bg-gray-700/50'
          }`}
        >
          <CloudArrowUpIcon className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-blue-400' : 'text-gray-500'}`} />
          <p className="text-lg font-bold text-gray-300">اسحب وأفلت ملف PDF هنا</p>
          <p className="text-sm text-gray-500">أو <span className="text-blue-400 font-semibold">تصفح الملفات</span></p>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-400 font-bold flex items-center gap-2 animate-bounce">
          <XCircleIcon className="w-5 h-5"/>
          {error}
        </p>
      )}
    </div>
  );
};