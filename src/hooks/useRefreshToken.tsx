import { supabase } from "@/libs/supabase";

import { useEffect } from "react";
import useAuth, { AuthState } from "./useAuth";
import { User } from "@/types/types";

type RefreshTokenFunction = () => Promise<string | null>;

const useRefreshToken = () => {
  const {auth, setAuth } = useAuth();

  const refresh: RefreshTokenFunction = async () => {
    const { error, data } = await supabase.auth.getSession();
    if (!error && data && data.session && data.session.refresh_token) {
      const { data: refreshData, error: refreshError } =
        await supabase.auth.refreshSession();
      if (refreshError) {
        console.error("Failed to refresh token:", refreshError.message);
        return null;
      }
      // Update the auth state with the refreshed token
      const userData = refreshData?.user;
      const refreshedSession = refreshData?.session;

      //@ts-ignore
      setAuth(userData);
      console.log("Refreshed token session", refreshedSession);
      console.log(" user session", auth);
      console.log("Refreshed token session", userData);
      return refreshedSession?.access_token || null;
    } else {
      console.error("No refresh token found in session");
      return null;
    }
  };

  // Automatically refresh the token when the component mounts
  useEffect(() => {
    refresh();
  }, []);

  return refresh;
};

export default useRefreshToken;
