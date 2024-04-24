"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Upload from "@/app/admin/dashboard/upload";
import { supabase } from "@/libs/supabase";
import { useRouter } from "next/navigation";
import useAxiosPrivate from "@/hooks/usePrivateAxios";
import Loader from "@/components/Loader";
import useAuth from "@/hooks/useAuth";
import useSendUserToDB from "@/hooks/useSendUserToDB";
import { UserMetadata } from "@/types/types";
import useLogout from "@/hooks/useLogout";
import useRefreshToken from "@/hooks/useRefreshToken";
import { Session } from "@supabase/supabase-js";

function Page() {
  const [userData, setUserData] = useState<UserMetadata | null | string>(null);
  const [authData, setAuthData] = useState<Session | null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const handleLoading = () => setIsLoading((prev) => !prev);
  const router = useRouter();
  const axiosPrivate = useAxiosPrivate();
  const { setAuth, auth } = useAuth();
  const sendUserToDb = useSendUserToDB();
  const refresh = useRefreshToken();
  const logOut = useLogout();

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

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("error signing out", error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get("access_token");
    let isMounted = true;
    const controller = new AbortController();

    if (accessToken) {
      const fetchUser = async (): Promise<void> => {
        try {
          const response = await axiosPrivate.get("/user", {
            // signal: controller.signal,
          });
          console.log("Dashboard", response.data);
          setAuth(response.data);
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
    // return () => {
    //   isMounted = false;
    //   controller.abort();
    // };
  }, []);

  useEffect(() => {
    const storedUserDataString =
      typeof window !== "undefined" ? localStorage.getItem("user_data") : null;

    if (storedUserDataString) {
      const parsedUserData = JSON.parse(storedUserDataString);
      setUserData(parsedUserData);
    }

    console.log("storedUserDataString", storedUserDataString);

    setUserData(
      JSON.parse(
        JSON.stringify(JSON.parse(storedUserDataString as string), null, 2)
      )
    );
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (typeof auth === "object" && auth !== null) {
        await sendUserToDb(auth);
      }
    };

    fetchData();
    setAuthData(auth);
    console.log("________", auth);
    console.log("________", authData);

    // Note: Since fetchData doesn't return a cleanup function, the cleanup logic is omitted
  }, [auth]);

  const returnValues: UserMetadata = JSON.parse(
    JSON.stringify(userData, null, 2)
  );
  console.log("dashboard values", returnValues);
  console.log("dashboard Auth", auth);

  return (
    <div>
      {isFetching && (
        <Loader
          loaderText=" loading Admin Studio"
          handleLoading={handleLoading}
        />
      )}
      {isLoading && (
        <Loader
          loaderText=" Uploading Asset ..."
          handleLoading={handleLoading}
        />
      )}
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
                <div className="flex space-x-5 items-center">
                  <p
                    className="text-[32px] font-bold cursor-pointer"
                    onClick={handleLogOut}
                  >
                    LogOut
                  </p>
                  {/* {JSON.stringify(auth)} */}
                  <div className="text-black">
                    {auth ? (
                      <>
                        {/* {JSON.stringify(userData)} */}
                        <div>
                          <div className="p-2 flex flex-row gap-2 rounded-full ">
                            <Image
                              height={20}
                              width={40}
                              src={auth?.user?.user_metadata?.picture}
                              alt="rice"
                              className="z-10 rounded-full"
                            />
                            <div className="text-[12px] pr-[50px]">
                              <p>
                                {auth?.user?.user_metadata?.email as string}
                              </p>
                              <p>{auth?.user?.user_metadata?.full_name} </p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {userData}
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
                      </>
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
            <Upload handleLoading={handleLoading} loading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Page;
