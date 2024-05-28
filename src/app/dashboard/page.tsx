"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Upload from "@/app/dashboard/upload";
import { createClient } from "../../../lib/supabase/client";
import Navbar from "@/components/common/navbar/Navbar";

async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("user data", user);
  const content = (
    <>
      <div>
        <div className=" ">
          <Navbar />
          <div className="flex ">
            <div className=" w-[300px] pl-10 bg-white ">
              <Link href="/" className="flex gap-4 text-[18px] pt-4">
                <Image
                  height={60}
                  width={20}
                  src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1708059974/utilities/Laptop_Upload_vzergq.svg"
                  alt="rice"
                  className="rounded-full"
                />
                Upload
              </Link>
            </div>
            <div className=" flex w-full pt-[45px] bg-[#ececec]">
              <Upload handleLoading={() => {}} loading={true} />
            </div>
          </div>
        </div>
      </div>
      {/* </AuthProvider> */}
    </>
  );

  return content;
}
export default Page;
