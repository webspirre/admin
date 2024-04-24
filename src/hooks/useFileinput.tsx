import { useState } from "react";
import useLocalStorage from "./useLocalStorage";

// Define types for key and initValue
type StorageKey = string;
type InitialValue<T> = T | (() => T);

const useInput = <T,>(
  key: StorageKey,
  initValue: InitialValue<T>
): [
  T,
  () => void,
  { value: T; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }
] => {
  const [value, setValue] = useLocalStorage<T>(key, initValue);

  const reset = () => setValue(initValue);

  const attributeObj = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(e.target.value as T),
  };

  return [value, reset, attributeObj];
};

export default useInput;  
//handleFileChange(file, "mobileFp", "mobileFpURL")
   