// hooks/usePersistToken.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";
import useLocalStorage from "./useLocalStorage";

const usePersistToken = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const [persist] = useLocalStorage("persist", true);

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    if (!auth || !auth.access_token ) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, [auth, persist, refresh]);

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`accessToken: ${auth?.access_token}`);
  }, [isLoading, auth?.access_token]); // Added null check for auth access_token

  useEffect(() => {
    // Redirect to login if token is not present
    if (!auth || !auth.access_token|| !isLoading) {
      // Added null check for auth
      router.push("/admin/auth/login");
    }
  }, [auth, persist, isLoading, router]);

  return { isLoading };
};

export default usePersistToken;
