"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "../../../../lib/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { getRedirectMethod } from "../../../../lib/auth-helpers/settings";
import { handleRequest } from "../../../../lib/auth-helpers/client";
import { SignOut } from "../../../../lib/auth-helpers/server";
import useAuth from "@/hooks/useAuth";
import { User } from "@supabase/supabase-js";
import useClearFormStorage from "@/hooks/custom-hooks/localstorage/useClearFormStorage";

interface NavProps {
  user?: User | null;
}

const Navbar: React.FC<NavProps> = ({}) => {
  const supabase = createClient();
  const { auth: user } = useAuth();

  const router = getRedirectMethod() === "client" ? useRouter() : null;

  const pathname = usePathname();

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-10 w-full">
        <div className="flex items-center border-b-[1px] border-[#BBBBBB]  bg-white">
          <div className="flex min-w-[250px] pl-12 bg-white ">
            <Link
              href={user ? "/dashboard/content" : "/"}
              onClick={(e) => {
                e.preventDefault(); // Prevent the default link behavior
                window.location.href = user ? "/dashboard/content" : "/"; // Force a full page reload
                sessionStorage.removeItem("selectedFilters");
              }}
            >
              <Image
                height={60}
                width={120}
                src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1720865679/utilities/webspirre/webspirre-logo-long_na5afq.svg"
                alt="logo"
                className="rounded-lg"
              />
            </Link>
          </div>
          <div className="flex justify-between bg-[#ececec] px-4  items-center w-full border-b-1 text-slate-900  border-[#BBBBBB] h-[60px]">
            <p className="text-[22px] font-bold">Upload</p>
            <div className="flex">
              <div className="flex justify-end">
                <div className="flex space-x-5 items-center">
                  <form
                    onSubmit={(e) => {
                      handleRequest(e, SignOut, router);
                      useClearFormStorage();
                    }}
                  >
                    <input
                      type="hidden"
                      name="pathName"
                      // eslint-disable-next-line react-hooks/rules-of-hooks
                      value={pathname}
                    />
                    <button
                      type="submit"
                      className="cursor-pointer bg-red-600 text-white font-semibold text-sm px-6 py-2 rounded-md shadow-lg hover:bg-red-700 hover:shadow-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                    >
                      Log Out
                    </button>
                  </form>

                  <div className="text-black">
                    {user ? (
                      <div>
                        <div className="flex items-center gap-4 p-1.5 bg-gray-100 rounded-full shadow-sm">
                          <Image
                            height={40}
                            width={40}
                            src={
                              "https://res.cloudinary.com/dwqantex4/image/upload/v1716927592/profile_image_exayvy.png"
                            }
                            alt="profile"
                            className="rounded-full border-2 border-gray-200 shadow-md"
                          />
                          <div className="text-sm">
                            <p className="font-medium text-gray-700">
                              {user?.email as string}
                            </p>
                            <p className="capitalize text-gray-500">Admin</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p>NOT AUTHORIZED</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
