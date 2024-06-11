import React from "react";
import { useState, useEffect } from "react";

const UploadLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 95 ? prev + 1 : prev));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [progress]);

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
        <p className="text-[14px] text-[#94A3B8] font-semibold">
          Drag and drop here or <span className="text-black">Upload </span>{" "}
          Image
        </p>
        <div className="w-full mx-40 bg-gray-200 rounded-full h-4 mt-4">
          <div
            className="bg-slate-900 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default UploadLoader;
