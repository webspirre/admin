import { ModalType } from "@/types/Modal.type";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Image from "next/image";
import React, { Fragment, useState } from "react";

const SuccessModal: React.FC<ModalType> = ({
  open,
  toogleModal,
  setPreview,
}) => {
  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={toogleModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* <div className="fixed inset-0 bg-black/75" /> */}
            <div className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-full md:max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center p-3 border-b mb-5 w-full">
                    <DialogTitle
                      as="h3"
                      className="text-xs font-medium leading-6 text-gray-900"
                    >
                      Upload Modal
                    </DialogTitle>

                    <Image
                      height={10}
                      width={10}
                      onClick={toogleModal}
                      alt="img"
                      src="https://res.cloudinary.com/dwqantex4/image/upload/v1718104910/x_as7ir4.png"
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-y-4 justify-center items-center w-full">
                    <Image
                      height={200}
                      width={200}
                      alt="img"
                      src="https://res.cloudinary.com/dwqantex4/image/upload/v1718100335/hero_H1_and_vector_1_fw6lot.png"
                      className="w-]"
                    />
                    <p className="text-xs text-center max-w-full sm:max-w-4xl text-black font-semibold">
                      This design has been successfully uploaded to the
                      Webspirre library.
                    </p>
                    <div className="flex flex-col justify-center items-center sm:flex-row gap-3 w-full max-w-[70%] mx-auto p-4">
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
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default SuccessModal;
