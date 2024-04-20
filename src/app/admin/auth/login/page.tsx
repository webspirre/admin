"use client";

import Image from "next/image";
import Link from "next/link";
import React, {useEffect} from "react";
import { supabase } from "@/libs/supabase";
import axios from "axios";

function Login() {



   const loginWithGoogle = async () => {
     try {
       const { error, data } = await supabase.auth.signInWithOAuth({
         provider: "google",
         options: {
           queryParams: {
             access_type: "offline",
             prompt: "consent",
           },
         },
       });

       if (error) {
         throw error;
       }
     } catch (error) {
       console.error("Error logging in with Google:", error);
     }
   };

   useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get("access_token");

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);

      const fetchUser = async (): Promise<void> => {
        try {
          const response = await axios.get(
            "https://nawqzhetlcutvfqhyjsv.supabase.co/auth/v1/user",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          localStorage.setItem("userData", JSON.stringify(response.data));
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
              const response = await axios.post(
                "https://nawqzhetlcutvfqhyjsv.supabase.co/auth/v1/token?grant_type=refresh_token&refresh_token=" +
                  refreshToken
              );
              const newAccessToken = response.data.access_token;

              localStorage.setItem("accessToken", newAccessToken);

              return fetchUser();
            } else {
              console.error("Refresh token not found.");
            }
          } else {
            console.error("Error fetching user data:", error);
          }
        }
      };

      fetchUser();
    }
  }, []);

  return (
    <div className="mt-[100px] w-full flex justify-center items-center">
      <div className="flex flex-col items-center justify-center gap-4  bg-white rounded-lg shadow-lg w-fit p-[20px] py-[100px]">
        <Link href="/">
          <Image
            height={20}
            width={200}
            src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1705721941/utilities/logo_e8rxwj.svg"
            alt="left"
            className=""
          />
        </Link>

        <div className="w-[800px] text-black" >
          <h1 className="text-center text-[12px] py-4 font-bold">
            Welcome Back, Sir
          </h1>
          <p className="text-center text-[13px] mb-4">
            Skip the hard part. Get inspiration from the internet&apos;s <br />
            best designed and highest-converting websites
          </p>
        </div>
        <button
          className="text-black font-bold hover:text-slate-500 transition duration-150 "
          onClick={loginWithGoogle}
        >
          <div className="bg-white shadow-md flex items-center p-4 border rounded-full text-[20px]">
            <img
              src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1713534276/utilities/Google_Icons-09-512_howar9.webp"
              alt=""
              width="34px"
              height="34px"
            />{" "}
            Sign In with Google
          </div>
        </button>

        <p className="text-[13px] text-[#64748B]">
          By continuing to sign up, you confirm that you agree <br /> to
          Webspirre&apos;s Terms & Conditions and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default Login;
