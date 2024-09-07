import { useEffect } from "react";

const usePreventNavigation = (searchQuery: string | null | undefined) => {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (typeof searchQuery === "string" && searchQuery.trim() !== "") {
        const confirmLeave = window.confirm(
          "You have an active search query. Are you sure you want to leave this page?"
        );
        if (!confirmLeave) {
          e.preventDefault();
          (e as any).returnValue = "";
        }
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [searchQuery]);
};

export default usePreventNavigation;
