"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";
import { User } from "@supabase/supabase-js";
import Loader from "./Loader";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import useClearFormStorage from "@/hooks/custom-hooks/localstorage/useClearFormStorage";

interface DashboardProps {
  user?: User | null;
  childrenProp?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardProps> = ({ childrenProp }) => {
  const { loading, setLoading } = useAuth();
  const pathname = usePathname();

  const handleLoading = () => {
    setLoading((prev) => !prev);
  };

  const clearForm = () => useClearFormStorage();

  const showUpload =
    pathname.startsWith("/dashboard") &&
    !pathname.includes("/dashboard/content");

  return (
    <>
      {loading && (
        <Loader handleLoading={handleLoading} loaderText="Loading Asset" />
      )}
      <div className="flex ">
        <div className="min-w-[250px] min-h-screen px-6 bg-white ">
          <Link
            href={"/dashboard"}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/dashboard";
              clearForm();
            }}
            className={`flex fixed  gap-4 items-center mt-[100px] w-[200px] rounded-[12px]  px-4 py-3 text-[16px] mb-4 font-semibold hover-black overflow-hidden hover:scale-100 transition-transform duration-300 text-black ${
              showUpload ? "bg-[#F2F2F7] rounded-[12px] w-[200px]" : ""
            }`}
          >
            <Image
              height={60}
              width={20}
              src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1708059974/utilities/Laptop_Upload_vzergq.svg"
              alt="Upload"
            />
            Upload
          </Link>
          <Link
            href={"/dashboard/content"}
            className={`flex fixed gap-4 items-center mt-[170px] w-[200px] rounded-[12px]  px-4 py-3 text-[16px] mb-4 font-semibold hover-black overflow-hidden hover:scale-100 transition-transform duration-300 text-black  ${
              !showUpload ? "bg-[#F2F2F7] rounded-[12px] w-[200px]" : ""
            }`}
          >
            <Image
              height={60}
              width={20}
              src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718468606/utilities/webspirre/Document_fh5fso.svg"
              alt="Content"
            />
            Content
          </Link>
        </div>
        <div className="flex w-full pt-[2px] mt-[80px] bg-[#ececec]">
          <div className="w-full pr-6">{childrenProp}</div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
