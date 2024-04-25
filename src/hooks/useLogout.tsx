import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth, { AuthState } from "./useAuth";
import { supabase } from "@/libs/supabase";

type LogoutFunction = () => Promise<void>; // Changed Promise<null> to Promise<void> for consistency

const useLogout = () => {
  const { setAuth, auth } = useAuth();
  const router = useRouter();

  const logout: LogoutFunction = async () => {
    try {
      await supabase.auth.signOut();
      setAuth(null); // Clear the authentication state
      router.push("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    // Redirect to login if token is not present
    if (!auth || !auth.access_token) {
      localStorage.removeItem("user_data");
      localStorage.removeItem("sb-nawqzhetlcutvfqhyjsv-auth-token");
      localStorage.removeItem("persist");
      // router.push("/dashboard");
      router.push("/login"); // Redirect to login page after logout
    }
  }, [auth, router]);

  return logout;
};

export default useLogout;
