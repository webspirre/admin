"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import usePersistToken from "@/hooks/usePersistance";
import Page from "./dashboard/page";

export default function Admin() {
  const { isLoading, persist } = usePersistToken();
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

  return (
    <>
      {!persist ? (
        // Render the component if persist is not enabled
        // You can replace this with your Next.js routing logic
        <Page />
      ) : isLoading ? (
        // Render loading state if persist is enabled and still loading
        <p>Loading...</p>
      ) : (
        // Render the component if persist is enabled and not loading
        // You can replace this with your Next.js routing logic
        <Page />
      )}
    </>
  );
}
