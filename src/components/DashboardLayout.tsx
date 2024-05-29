"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Upload from "../app/dashboard/upload";
import { User } from "@supabase/supabase-js";
import Loader from "./Loader";

interface DashboardProps {
  user: User | null;
}
const DashboardLayout: React.FC<DashboardProps> = () => {
  const [loading, setLoading] = useState(false);

  const handleLoading = () => {
    setLoading((prev) => !prev);
  };
  return (
    <>
      {loading && (
        <Loader handleLoading={handleLoading} loaderText="Loading Asset" />
      )}
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
          <Upload handleLoading={handleLoading} loading={loading} />
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
