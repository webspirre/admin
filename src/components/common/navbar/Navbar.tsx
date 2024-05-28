import React from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "../../../../lib/supabase/client";

const Navbar = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("USER LOG", user);
  return (
    <>
      <div className=" ">
        <div className="flex items-center border-b-2 border-[#BBBBBB]  bg-white">
          <div className="flex w-[300px] pl-10   bg-white h-100px">
            <Link href="/">
              <Image
                height={60}
                width={150}
                src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1705721941/utilities/logo_e8rxwj.svg"
                alt="rice"
                className="rounded-lg"
              />
            </Link>
          </div>
          <div className="flex justify-between bg-[#ececec] px-4  items-center w-full border-b-1 text-slate-900  border-[#BBBBBB] h-[100px]">
            <p className="text-[32px] font-bold">Upload</p>
            <div className="flex">
              <div className="flex justify-end">
                <div className="flex space-x-5 items-center">
                  <p
                    className="text-[32px] font-bold cursor-pointer"
                    // onClick={handleLogOut}
                  >
                    LogOut
                  </p>
                  <div className="text-black">
                    {user ? (
                      <div>
                        <div className="p-2 flex flex-row gap-2 rounded-full">
                          <Image
                            height={20}
                            width={40}
                            src={user?.user_metadata?.picture}
                            alt="rice"
                            className="z-10 rounded-full"
                          />
                          <div className="text-[12px] pr-[50px]">
                            <p>{user?.email as string}</p>
                            <p>{user?.user_metadata?.full_name}</p>
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
