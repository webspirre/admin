"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { signInWithPassword } from "../../../lib/auth-helpers/server";
import { handleRequest } from "../../../lib/auth-helpers/client";

// export const metadata: Metadata = {
//   title: "CoreReg Transaction Management Dashboard",
//   description: "This is a transaction management dashboard",
// };

const SignIn: React.FC = () => {
  let redirectMethod = "client";
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = redirectMethod === "client" ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signInWithPassword, router);
    setIsSubmitting(false);
  };

  return (
    <div>
      <div className="h-screen rounded-sm  bg-white pt-[100px] dark:bg-boxdark sm:h-full sm:bg-transparent">
        <div className="flex items-center justify-center">
          <div className=" flex w-fit flex-col items-center justify-center rounded-[20px] bg-white dark:border-strokedark sm:p-12.5  xl:w-1/2 xl:p-17.5 ">
            <Image
              width={166}
              height={32}
              src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1715418225/utilities/Frame_672_ynbhv2.svg"
              alt="Logo"
              className="mt-[20px]"
              priority
            />

            <div className="w-full p-4 ">
              <form noValidate={true} onSubmit={(e) => handleSubmit(e)}>
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
                    Password{" "}
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
                  <input
                    type="submit"
                    value="Login"
                    className="w- cursor-pointer rounded-lg border border-primary bg-[#4608AD] px-6 py-2 font-bold text-white transition hover:bg-opacity-90"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
