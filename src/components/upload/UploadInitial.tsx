import React from "react";
interface UploadInitiaProp {
  fileSize: string;
}
const UploadInitial: React.FC<UploadInitiaProp> = ({ fileSize }) => {
  return (
    <>
      <div className="bg-[#FDFAF7] px-auto w-full py-20 justify-center items-center flex flex-col space-y-4 h-[120px] overflow-hidden rounded-xl border border-slate-100">
        <img
          height={50}
          width={50}
          src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1708135436/utilities/Laptop_Upload_1_basxso.svg"
          alt="Upload icon"
          className="cursor-pointer z-"
        />
        <p className="text-[14px] text-[#94A3B8] font-semibold">
          Drag and drop here or <span className="text-black">Upload </span>{" "}
          Image
        </p>
        <p className="text-[10px] text-[#94A3B8] z-1">
          Recommended sized{" "}
          <span className="text-black font-semibold">{fileSize}</span>{" "}
        </p>
      </div>
    </>
  );
};

export default UploadInitial;
