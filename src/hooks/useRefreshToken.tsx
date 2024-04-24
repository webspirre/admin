import { supabase } from "@/libs/supabase";

import { useEffect } from "react";
import useAuth, { AuthState } from "./useAuth";
import { User, UserMetadata } from "@/types/types";

type RefreshTokenFunction = () => Promise<{
  access_token: string | null;
  user_metadata: UserMetadata | null;
} | null>;

const useRefreshToken = () => {
  const { auth, setAuth, setAuthUser, authUser } = useAuth();

  const refresh = async () => {
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
      localStorage.setItem(
        "user_data",
        JSON.stringify(refreshedSession?.user?.user_metadata)
      );
      setAuth((prev) => {
        console.log(JSON.stringify(prev));
        console.log(refreshedSession);
        return {
          ...prev,
          ...refreshedSession,
        };
      });

      setAuthUser(
        // @ts-ignore
        typeof window !== "undefined" ? localStorage.getItem("user_data") : null
      );
      console.log(" user session", userData);
      console.log("Refreshed token session", refreshedSession);
      console.log("Refreshed token session", auth);
      return {
        access_token: refreshedSession?.access_token || null,
        user_metadata: refreshedSession?.user?.user_metadata || null,
      };
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
