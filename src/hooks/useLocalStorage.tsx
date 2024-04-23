import { useState, useEffect, Dispatch, SetStateAction } from "react";

// Define types for key and initValue
type StorageKey = string;
type InitialValue<T> = T | (() => T);

const getLocalValue = <T,>(key: StorageKey, initValue: InitialValue<T>): T => {
  // SSR Next.js
  if (typeof window === "undefined") return initValue as T;

  // if a value is already stored
  const localValue = JSON.parse(
    localStorage.getItem(key) || "null"
  ) as T | null;
  if (localValue !== null) return localValue;

  // return result of a function
  if (initValue instanceof Function) return (initValue as () => T)();

  return initValue as T;
};

const useLocalStorage = <T,>(
  key: StorageKey,
  initValue: InitialValue<T>
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    return getLocalValue<T>(key, initValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
