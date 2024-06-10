import React from "react";
interface UploadInitiaProp {
  fileSize: string;
}
const UploadInitial: React.FC<UploadInitiaProp> = ({ fileSize }) => {
  return (
    <>
      <div className="bg-[#FDFAF7] px-auto w-full py-20 justify-center items-center flex flex-col space-y-4">
        <img
          height={60}
          width={60}
          src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1708135436/utilities/Laptop_Upload_1_basxso.svg"
          alt="Upload icon"
          className="cursor-pointer"
        />
        <p className="text-lg text-[#94A3B8] font-semibold">
          Drag and drop here or <span className="text-black">Upload </span>{" "}
          Image
        </p>
        <p>
          Recommended sized{" "}
          <span className="text-slate-900 font-semibold">{fileSize}</span>{" "}
        </p>
      </div>
    </>
  );
};

export default UploadInitial;
