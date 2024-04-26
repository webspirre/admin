import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_tk");

    if (!accessToken) {
      const redirectTimeout = setTimeout(() => {
        router.push("/login");
      }, 8000);

      return () => clearTimeout(redirectTimeout);
    } else {
      router.push("/");
    }
  }, []);

  return null; // or you can return a loading indicator if needed
};

export default useAuthRedirect;
