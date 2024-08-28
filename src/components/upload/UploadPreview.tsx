import Image from "next/image";
import React from "react";

interface UploadPreviewProp {
  imgPreview: string | null;
  setImagePreview: React.Dispatch<
    React.SetStateAction<{ [key: string]: string | null }>
  >;
  filename: string;
}

let imglink =
  "https://res.cloudinary.com/dwqantex4/image/upload/v1717091843/webspirre_assests/wyduuzzl7allegx5rsin.webp";

const UploadPreview: React.FC<UploadPreviewProp> = ({
  imgPreview,
  filename,
  setImagePreview,
}) => {
  return (
    <div className="relative w-full py-10 flex flex-col items-center justify-center space-y-4 bg-[#FDFAF7] rounded-lg shadow-md">
      <img
        src={imgPreview ? imgPreview : imglink}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-lg"
      />

      <button
        className="absolute top-4 right-4 w-8 h-8 bg-white p-1 rounded-full hover:bg-red-600 duration-100 delay-75 transition cursor-pointer flex items-center"
        onClick={() =>
          setImagePreview((prev) => ({ ...prev, [filename]: null }))
        }
      >
        <Image
          src="https://res.cloudinary.com/dwqantex4/image/upload/v1717939355/Delete_s0cip0.png"
          alt="delete"
          width={20}
          height={20}
          className="text-red-600"
        />
      </button>

      <div className="relative flex flex-col items-center space-y-4">
        {imgPreview ? (
          <img
            src={imgPreview}
            alt="Uploaded preview"
            height={100}
            width={100}
            className="object-contain rounded-lg border-2 border-gray-200"
          />
        ) : (
          <img
            height={120}
            width={120}
            src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1708135436/utilities/Laptop_Upload_1_basxso.svg"
            alt="Upload icon"
            className="object-contain "
          />
        )}
        <p className="text-lg font-medium">{filename}.png</p>
      </div>
    </div>
  );
};

export default UploadPreview;
