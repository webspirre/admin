"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithPassword } from "../../../lib/auth-helpers/server";
import { handleRequest } from "../../../lib/auth-helpers/client";

const SignIn: React.FC = () => {
  let redirectMethod = "client";
  const router = redirectMethod === "client" ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // Set loading state to true
    await handleRequest(e, signInWithPassword, router);
    setIsSubmitting(false); // Set loading state to false after request completes
  };

  return (
    <div>
      <div className="h-screen rounded-sm  bg-white pt-[100px] dark:bg-boxdark sm:h-full sm:bg-transparent">
        <div className="flex items-center justify-center">
          <div className=" flex w-fit flex-col items-center justify-center rounded-[20px] bg-white dark:border-strokedark sm:p-12.5  xl:w-1/2 xl:p-17.5 ">
            <Image
              width={166}
              height={32}
              src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1705721941/utilities/logo_e8rxwj.svg"
              alt="Logo"
              className="mt-[20px]"
              priority
            />
            <div className="w-full p-4 ">
              <form noValidate={true} onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      required
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-stroke bg-whiten py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      placeholder="6+ Characters, 1 Capital letter"
                      className="w-full rounded-lg border border-stroke bg-whiten py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-5 flex w-full items-center justify-center">
                  <button
                    type="submit"
                    className="w- cursor-pointer rounded-lg border border-primary bg-[#4608AD] px-6 py-2 font-bold text-white transition hover:bg-opacity-90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="loader"></div> {/* Add a loader here */}
                        <span className="ml-2">Logging in...</span>{" "}
                        {/* Loading text */}
                      </div>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default SignIn;
