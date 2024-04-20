"use client"

import Admin from "./admin/page";
import axios from "axios";
import React, {useEffect} from "react";


export default function Home() {
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
    <>
      <Admin/>
    </>
  );
}
