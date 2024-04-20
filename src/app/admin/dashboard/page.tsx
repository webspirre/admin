"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Uploade from "./upload";
import { supabase } from "@/libs/supabase";
import { OAuthResponse, Provider } from "@supabase/supabase-js";
import axios from "axios";
import { User } from "@/types/types";
import { create } from "@/app/actions/create";
import Loader from "@/components/Loader";

function Page() {
  const [userData, setUserData] = useState<User | null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleLoading = () => setIsLoading((prev) => !prev);

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

  useEffect(() => {
    const storedUserDataString =
      typeof window !== "undefined"
        ? localStorage.getItem("sb-nawqzhetlcutvfqhyjsv-auth-token")
        : null;

    if (storedUserDataString) {
      const parsedUserData = JSON.parse(storedUserDataString);
      setUserData(parsedUserData);
    }

    setUserData(
      JSON.parse(
        JSON.stringify(JSON.parse(storedUserDataString as string), null, 2)
      )
    );
  }, []);

  useEffect(() => {
    const sendToDb = async (data: User) => {
      if (data) {
        const { user } = data;
        const { id, email } = user;
        const idAsBigInt = String(BigInt(`0x${id.replace(/-/g, "")}`));
        const { data: userData, error: insertError } = await supabase
          .from("administrators")
          .insert([
            {
              email,
              created_at: new Date(),
              userid: id,
              role: "admin",
            },
          ]);

        if (insertError) {
          console.log(insertError);
          console.log("Error Message", insertError.message);
          throw insertError;
        }
      }
    };

    if (typeof userData === "object" && userData !== null) {
      sendToDb(userData);
    }
  }, [userData]);

  const returnValues: User = JSON.parse(JSON.stringify(userData, null, 2));

  return (
    <div>
      {isLoading && <Loader />}
      <div className=" ">
        <div className="flex items-center border-b-2 border-[#BBBBBB]  bg-white">
          <div className="flex w-[300px] pl-10   bg-white h-100px">
            <Link href="/">
              <Image
                height={60}
                width={150}
                src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1705721941/utilities/logo_e8rxwj.svg"
                alt="rice"
                className="rounded-lg"
              />
            </Link>
          </div>
          <div className="flex justify-between bg-[#ececec] px-4  items-center w-full border-b-1 text-slate-900  border-[#BBBBBB] h-[100px]">
            <p className="text-[32px] font-bold">Upload</p>
            <div className="flex">
              <div className="flex justify-end">
                <div>
                  <div className="text-black">
                    {returnValues ? (
                      <>
                        <div>
                          <div className="p-2 flex flex-row gap-2 rounded-full ">
                            <Image
                              height={20}
                              width={40}
                              src={returnValues?.user?.user_metadata?.picture}
                              alt="rice"
                              className="z-10 rounded-full"
                            />
                            <div className="text-[12px] pr-[50px]">
                              <p>{returnValues?.user?.email as string}</p>
                              <p>
                                {returnValues?.user?.user_metadata?.full_name}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <button
                        className="text-black font-bold hover:text-slate-500 transition duration-150 "
                        onClick={loginWithGoogle}
                      >
                        <div className="bg-white flex items-center p-4 border rounded-full">
                          <img
                            src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1713534276/utilities/Google_Icons-09-512_howar9.webp"
                            alt=""
                            width="34px"
                            height="34px"
                          />{" "}
                          Sign In with Google
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            <Uploade handleLoading={handleLoading} loading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Page;
