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

interface NavProps {
  user: User | null;
}

const Navbar: React.FC<NavProps> = ({ user }) => {
  const supabase = createClient();
  const {} = useAuth();

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  const router = getRedirectMethod() === "client" ? useRouter() : null;

  const pathname = usePathname();

  // console.log("USER LOG", user);
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-10 w-full">
        <div className="flex items-center border-b-[1px] border-[#BBBBBB]  bg-white">
          <div className="flex w-[350px] pl-12 bg-white ">
            <Link href="/">
              <Image
                height={60}
                width={100}
                src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1705721941/utilities/logo_e8rxwj.svg"
                alt="rice"
                className="rounded-lg"
              />
            </Link>
          </div>
          <div className="flex justify-between bg-[#ececec] px-4  items-center w-full border-b-1 text-slate-900  border-[#BBBBBB] h-[60px]">
            <p className="text-[22px] font-bold">Upload</p>
            <div className="flex">
              <div className="flex justify-end">
                <div className="flex space-x-5 items-center">
                  <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
                    <input
                      type="hidden"
                      name="pathName"
                      // eslint-disable-next-line react-hooks/rules-of-hooks
                      value={pathname}
                    />
                    <button
                      type="submit"
                      className={
                        "cursor-pointer text-red-600 font-bold text-lg "
                      }
                    >
                      Log out
                    </button>
                  </form>

                  <div className="text-black">
                    {user ? (
                      <div>
                        <div className="p-2 flex flex-row gap-2 rounded-full">
                          <Image
                            height={20}
                            width={40}
                            src={
                              "https://res.cloudinary.com/dwqantex4/image/upload/v1716927592/profile_image_exayvy.png"
                            }
                            alt="rice"
                            className="z-10 rounded-full"
                          />
                          <div className="text-[12px] pr-[50px]">
                            <p>{user?.email as string}</p>
                            <p className="capitalize">Admin</p>
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
