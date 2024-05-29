"use client";

import "./globals.css";
import Loader from "@/components/common/loader/index";
import { Toaster } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { AuthProvider } from "@/context/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Toaster />
        <div>
          {" "}
          {loading ? <Loader /> : <AuthProvider>{children}</AuthProvider>}
        </div>
      </body>
    </html>
  );
}
