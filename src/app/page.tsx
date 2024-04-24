"use client";

import useAxiosPrivate from "@/hooks/usePrivateAxios";
import Admin from "./admin/page";
import React, { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Home() {
  const axiosPrivate = useAxiosPrivate();
  const { setAuth, auth } = useAuth();
  const router = useRouter();
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
            const refreshToken = auth?.access_token;
            if (refreshToken) {
              const response = await axiosPrivate.post(
                "/token?grant_type=refresh_token&refresh_token=" + refreshToken
              );
              const newAccessToken = response.data.access_token;

              setAuth({
                user: response.data.user,
                access_token: newAccessToken,
              });

              return fetchUser();
            } else {
              console.error("Refresh token not found.");
            }
          } else {
            console.error("Error fetching user data:", error);
            toast.error(error, { duration: 2000 });
            // router.push("/admin/auth/login");
          }
        }
      };

      fetchUser();
    }
  }, []);
  return (
    <>
      <Admin />
    </>
  );
}
