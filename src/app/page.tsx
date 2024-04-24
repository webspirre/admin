"use client";

import useAxiosPrivate from "@/hooks/usePrivateAxios";
import Admin from "./admin/page";
import React, { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthProvider } from "@/context/AuthProvider";
import useRefreshToken from "@/hooks/useRefreshToken";

export default function Home() {
  const axiosPrivate = useAxiosPrivate();
  const { setAuth, auth } = useAuth();
  const router = useRouter();
  const refresh = useRefreshToken();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get("access_token");
    let isMounted = true;
    const controller = new AbortController();

    if (accessToken) {
      const fetchUser = async (): Promise<void> => {
        try {
          const response = await axiosPrivate.get("/user", {
            signal: controller.signal,
          });

          isMounted && setAuth(response.data);
          console.log("Mounted User", response.data);
          router.push("/admin/dashboard");
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            await refresh().then((_) => {
              console.log("refresh feedback", _);
              // setUserData(JSON.stringify(_?.user_metadata));
            });
          } else {
            console.error("Error fetching user data:", error);
            // router.push("/admin/auth/login");
            router.push("/admin/dashboard");
          }
        }
      };

      fetchUser();
    }
  }, []);
  return (
    <>
      <AuthProvider>
        <Admin />
      </AuthProvider>
      <div className="w-full h-auto justify-center items-center bg-slate-800 text-white">
        <p>Webspirre Admin Studio Loading</p>
      </div>
    </>
  );
}
