"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Upload from "../app/dashboard/upload";
import { User } from "@supabase/supabase-js";
import Loader from "./Loader";
import { sidebarLinks } from "@/util/util";

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
      <div className="flex h-screen mt-12 sn:mt-24">
        {/* Sidebar Component */}
        <div className="w-[250px] z-10 pl-10 bg-white fixed h-full border-l border-l-slate-500 shadow-md mt-10">
          {sidebarLinks.map((item) => (
            <div key={item.name} className="relative mt-3 group">
              <Link
                href="/"
                className="relative flex items-center gap-4 p-4 rounded-l-lg"
              >
                <div className="absolute inset-0 w-0 bg-slate-400 transition-all duration-300 ease-in-out group-hover:w-full rounded-l-lg"></div>
                <Image
                  height={60}
                  width={20}
                  src={item.imgUrl}
                  alt={item.name}
                  className="relative z-10 rounded-full transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
                <span className="relative z-10 text-black text-[14px] transition-colors duration-300 ease-in-out group-hover:text-white">
                  {item.name}
                </span>
              </Link>
            </div>
          ))}
        </div>
        {/* Main Content */}
        <div className="ml-[250px] w-full overflow-y-auto pt-[45px] bg-[#ececec] hide-scrollbar">
          <Upload handleLoading={handleLoading} loading={loading} />
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
