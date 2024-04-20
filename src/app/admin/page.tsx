"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Admin() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    if (isClient) {
      const token = localStorage.getItem("accessToken");

      if (token) {
        router.push("/admin/dashboard");
      } else {
        router.push("/admin/auth/login");
      }
    }
  }, [isClient, router]);

  return null;
}
