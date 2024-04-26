import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth, { AuthState } from "./useAuth";
import { supabase } from "@/libs/supabase";
import toast from "react-hot-toast";

type LogoutFunction = () => Promise<void>; // Changed Promise<null> to Promise<void> for consistency

const useLogout = () => {
  const { setAuth, auth } = useAuth();
  const router = useRouter();

  const logout: LogoutFunction = async () => {
    try {
      await supabase.auth.signOut();
      setAuth(null); // Clear the authentication state
      localStorage.clear();
      toast.success("Successfully logging you out 🥺", { duration: 2500 });
      router.push("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return logout;
};

export default useLogout;
// sam meech ward
