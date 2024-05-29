import { useEffect } from "react";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { axiosPrivate } from "@/api/baseAxios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = (): typeof axios => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (
          !config.headers["Authorization"] &&
          auth?.user_metadata?.access_token
        ) {
          config.headers[
            "Authorization"
          ] = `Bearer ${auth?.user_metadata.access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent && auth) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await refresh();
            console.log("New Access token", newAccessToken);
            prevRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken?.access_token}`;
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            // Handle token refresh error
            console.log("Token Refresh Error", refreshError);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate as typeof axios;
};

export default useAxiosPrivate;
