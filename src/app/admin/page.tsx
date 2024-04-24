"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import usePersistToken from "@/hooks/usePersistance";
import Page from "./dashboard/page";

export default function Admin() {
  const { isLoading } = usePersistToken();
  // const [isClient, setIsClient] = useState(false);
  // const router = useRouter();

  // useEffect(() => {
  //   setIsClient(true);

  //   if (isClient) {
  //     const token = localStorage.getItem("accessToken");

  //     if (token) {
  //       router.push("/admin/dashboard");
  //     } else {
  //       router.push("/admin/auth/login");
  //     }
  //   }
  // }, [isClient, router]);

  if (!isLoading) {
    return <p>Loading...</p>;
  }

  // return null;
  return <Page />;
}
