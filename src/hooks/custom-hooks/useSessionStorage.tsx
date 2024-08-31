import { useEffect, useState, useRef, useMemo } from "react";

const useSessionStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const storedValue = sessionStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    }
    return initialValue;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent(`update-${key}`));
    }
  }, [key, value]);

  const memoizedState = useMemo(() => [value, setValue], [value]);
  return memoizedState;
};

export default useSessionStorage;
