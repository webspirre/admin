import { useState, useEffect } from "react";

const useGetSessionStorage = <T,>(key: string) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const storedValue = sessionStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
    }
    return null;
  });

  useEffect(() => {
    const handleCustomEvent = () => {
      const storedValue = sessionStorage.getItem(key);
      setValue(storedValue ? JSON.parse(storedValue) : null);
    };
    window.addEventListener(`update-${key}`, handleCustomEvent);
    return () => {
      window.removeEventListener(`update-${key}`, handleCustomEvent);
    };
  }, [key]);

  return value;
};

export default useGetSessionStorage;