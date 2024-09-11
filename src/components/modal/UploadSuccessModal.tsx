import React, { useState } from "react";
import Image from "next/image";
import { ModalType } from "@/types/Modal.type";

const SuccessModal: React.FC<ModalType> = ({
  open,
  toogleModal,
  setPreview,
}) => {
  if (!open) return null; // Modal only renders when 'open' is true

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex justify-between items-center border-b mb-5 pb-3">
          <h3 className="text-xs font-medium leading-6 text-gray-900">
            Upload Modal
          </h3>
          <Image
            height={10}
            width={10}
            onClick={toogleModal}
            alt="close"
            src="https://res.cloudinary.com/dwqantex4/image/upload/v1718104910/x_as7ir4.png"
            className="cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-y-4 items-center">
          <Image
            height={200}
            width={200}
            alt="success"
            src="https://res.cloudinary.com/dwqantex4/image/upload/v1718100335/hero_H1_and_vector_1_fw6lot.png"
          />
          <p className="text-xs text-center font-semibold text-black">
            This design has been successfully uploaded to the Webspirre library.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center p-4">
            <button
              className="w-full sm:w-auto p-2.5 bg-white text-black text-xs font-medium border border-black rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out"
              onClick={toogleModal}
            >
              Cancel
            </button>
            <button
              className="w-full sm:w-auto p-2.5 bg-black text-white text-xs font-medium border border-black rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out"
              onClick={setPreview}
            >
              New Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
