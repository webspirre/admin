import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Preview, UploadInitial, UploadLoader } from "@/components/upload";
import { ImagePreviewState } from "@/types/imgPreview.type";
import ErrorMessage from "@/components/ui/ErrorMessage";

interface FileUploadProps {
  label: string;
  filename: string;
  onFileChange: (file: File, type: string, filename: string) => void;
  loading?: boolean;
  filesize?: string;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<ImagePreviewState>>;
  errorMsg?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  filename,
  onFileChange,
  loading,
  filesize,
  setImagePreview,
  imagePreview,
  errorMsg,
}) => {
  React.useEffect(() => {
    const savedFile = localStorage.getItem(`file-${filename}`);
    if (savedFile) {
      setImagePreview((prevState) => ({
        ...prevState,
        [filename]: savedFile,
      }));
    }
  }, [filename]);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        console.log("Reader File URL ", reader.result);
        reader.onloadend = () => {
          const base64String = reader.result as string;
          localStorage.setItem(`file-${filename}`, base64String);
          // setImagePreview(reader.result as string);
          setImagePreview((prevState) => ({
            ...prevState,
            [filename]: reader.result as string,
          }));
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
        className="flex w-full rounded-md justify-between items-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="bg-[#FDFAF7] px-auto w-full py-20 justify-center items-center flex flex-col space-y-4">
            <img
              height={50}
              width={50}
              src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1708135436/utilities/Laptop_Upload_1_basxso.svg"
              alt="Upload icon"
              className="cursor-pointer"
            />
            <p className="text-[15px] text-[#94A3B8] font-semibold ">
              Drop the file here...
            </p>
          </div>
        ) : loading ? (
          <UploadLoader />
        ) : imagePreview ? (
          <Preview
            imgPreview={imagePreview}
            // setImagePreview={setImagePreview}
            setImagePreview={() =>
              setImagePreview((prevState) => ({
                ...prevState,
                [filename]: null,
              }))
            }
            filename={filename}
          />
        ) : (
          <UploadInitial fileSize={filesize as string} />
        )}
      </div>
      <ErrorMessage message={errorMsg as string} />
    </div>
  );
};

export default FileUpload;
