import Image from "next/image";
import React from "react";

interface UploadPreviewProp {
  imgPreview: string | null;
  // setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
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
    <div className="relative w-full py-10 flex flex-col items-center justify-center space-y-2 bg-[#FDFAF7]">
      <img
        src={imgPreview ? imgPreview : imglink}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      <p
        className="absolute top-2.5 right-3.5 w-10 h-10 bg-white p-2 cursor-default z-[999] flex items-center justify-center rounded-md"
        onClick={() => setImagePreview}
      >
        <Image
          src="https://res.cloudinary.com/dwqantex4/image/upload/v1717939355/Delete_s0cip0.png"
          alt="delete"
          width={25}
          height={25}
          className=""
        />
      </p>

      <div className="relative flex flex-col items-center space-y-4">
        {imgPreview ? (
          <img
            src={imgPreview}
            alt="Uploaded preview"
            height={80}
            width={80}
            className="object-contain"
          />
        ) : (
          <img
            height={100}
            width={100}
            src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1708135436/utilities/Laptop_Upload_1_basxso.svg"
            alt="Upload icon"
            className="object-contain "
          />
        )}
        <p>{filename}.png</p>
      </div>
    </div>
  );
};

export default UploadPreview;
