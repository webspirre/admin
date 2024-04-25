import { supabase } from "@/libs/supabase";

import { useEffect } from "react";
import useAuth, { AuthState } from "./useAuth";
import { Session } from "@supabase/supabase-js";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

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

      // @ts-ignore
      setAuth((prev: Session | null) => {
        console.log(JSON.stringify(prev));
        return {
          ...prev,
          ...refreshedSession,
        };
      });

      console.log(
        "Refreshed token session",
        refreshedSession?.user.user_metadata
      );
      console.log("Refreshed token aufh", auth);
      return {
        access_token: refreshedSession?.access_token || null,
        user_metadata: refreshedSession?.user?.user_metadata || null,
      };
    } else {
      console.error("No refresh token found in session");
      return null;
    }
  };

  useEffect(() => {
    refresh();
  }, [auth]);

  return refresh;
};

export default useRefreshToken;
