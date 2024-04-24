"use client";

import React, { useState, useRef, ChangeEvent } from "react";

interface FileUploadProps {
  label: string;
  filename: string;
  onFileChange: (file: File, type: string, filename: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  filename,
  onFileChange,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileChange(file, label, filename);
      console.log("file content ", file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col w-full py-8 text-slate-700">
      <label htmlFor={label}>{label}</label>
      <div
        className="p-4 flex w-full border-2 border-gray-300 rounded-md justify-between items-center cursor-pointer"
        onClick={handleUploadClick}
      >
        <p className="text-[gray]">Upload</p>
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Uploaded preview"
            height={40}
            width={40}
            className="cursor-not-allowed"
          />
        ) : (
          <img
            height={20}
            width={20}
            src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1708135436/utilities/Laptop_Upload_1_basxso.svg"
            alt="Upload icon"
            className="cursor-pointer"
          />
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        required
        onChange={handleFileInputChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default FileUpload;
