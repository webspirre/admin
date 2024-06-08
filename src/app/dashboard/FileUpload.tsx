import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import type { Accept } from "react-dropzone";
import axios from "axios";

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
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onFileChange(file, label, filename);
      }
    },
    [label, filename, onFileChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg"],
    },
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    // @ts-ignore
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <div className="flex flex-col w-full py-8 text-slate-700">
      <label htmlFor={label}>{label}</label>
      <div
        {...getRootProps({ className: "dropzone" })}
        className="p-4 flex w-full border-2 border-gray-300 rounded-md justify-between items-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
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
    </div>
  );
};

export default FileUpload;
