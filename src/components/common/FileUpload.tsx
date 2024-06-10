"use client";

import React, { useState, useRef, ChangeEvent } from "react";

// Interface for the component props
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
  // State to store the preview URL of the uploaded image
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // State to manage the dragging state
  const [isDragging, setIsDragging] = useState(false);
  // State to store any error messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Ref to access the file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler for file input change event
  const handleFileInputChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const file = files[0];
    if (file) {
      // Check if the file is a PNG image
      if (file.type !== "image/png") {
        setErrorMessage("Error uploading file, please try again");
        setIsDragging(false);
        return;
      }

      // Clear any previous error messages
      setErrorMessage(null);
      setIsDragging(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Set the image preview state
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Notify the parent component of the file change
      onFileChange(file, label, filename);
    }
  };

  // Handler for drag over event
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  // Handler for drag leave event
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Handler for drop event
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      handleFileInputChange({
        target: { files },
      } as ChangeEvent<HTMLInputElement>);
    }
  };

  // Handler for upload button click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handler for delete button click
  const handleDeleteClick = () => {
    // Reset the image preview and error message states
    setImagePreview(null);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col w-full py-8 text-slate-700 relative">
      {/* Label for the file input */}
      <label htmlFor={label} className={errorMessage ? "text-red-600" : ""}>
        {label}
      </label>
      <div className="relative">
        <div
          className={`flex flex-col mt-2 relative w-full justify-center items-center py-[34px] rounded-[12px] border ${
            isDragging ? "bg-blue-100" : "bg-[#FDFAF7]"
          }`}
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Background pseudo-element */}
          {imagePreview && (
            <div
              className="absolute inset-0 bg-cover bg-center rounded-[12px]"
              style={{
                backgroundImage: `url(${imagePreview})`,
                opacity: 0.1,
              }}
            ></div>
          )}
          {/* Delete button, visible only when an image is uploaded */}
          {imagePreview && (
            <button
              className="absolute top-2 right-2  rounded-full z-10"
              onClick={handleDeleteClick}
            >
              <img
                src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718012100/utilities/webspirre/Frame_98_tgpshg.svg"
                alt=""
              />
            </button>
          )}
          {/* Display uploaded image or upload icon */}
          {imagePreview ? (
            <div className="w-[95px] h-[120px] overflow-hidden rounded-md border border-[#ffa65d] z-10">
              <img
                height={50}
                width={50}
                src={imagePreview}
                alt="Uploaded"
                className="cursor-pointer w-full"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
              />
            </div>
          ) : (
            <img
              height={50}
              width={50}
              src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1708135436/utilities/Laptop_Upload_1_basxso.svg"
              alt="Upload icon"
              className="cursor-pointer z-10"
            />
          )}
          {/* Display upload message or filename */}
          <p
            className={`text-[14px] mt-[20px] pb-[10px] font-medium ${
              imagePreview ? "text-black" : "text-[#94A3B8]"
            } z-10`}
          >
            {imagePreview ? filename : "Drag and drop here or Upload Image"}.png
          </p>
          {/* Hide recommended size when preview is shown */}
          {!imagePreview && (
            <p className="text-[10px] text-[#94A3B8] z-10">
              Recommended size <span className="text-black">400px x 400px</span>
            </p>
          )}
          {/* Display loading bar when dragging */}
          {isDragging && (
            <div className="px-10 w-full rounded-full">
              <p className="text-center text-[#94A3B8] text-[14px]">
                Uploading...
              </p>
              <div className="w-full h-2 rounded-full bg-white mt-4 z-10">
                <div className="w-1/2 h-full rounded-full bg-black"></div>
              </div>
            </div>
          )}
          {/* Display error message if there is an error */}
          {errorMessage && (
            <p className="text-red-600 mt-2 text-sm z-10">{errorMessage}</p>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileInputChange}
      />
    </div>
  );
};

export default FileUpload;
