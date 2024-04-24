import { useState } from "react";
import useLocalStorage from "./useLocalStorage";

// Define types for key and initValue
type StorageKey = string;
type InitialValue<T> = T | (() => T);

interface Option {
  value: string;
  label: string;
}

type FormData = {
  [key: string]:
    | string
    | string[]
    | undefined
    | Option
    | Option[]
    | File
    | null;
};

const useFormInput = (
  key: StorageKey,
  initialFormData: InitialValue<FormData>
): [
  FormData,
  () => void,
  {
    [key: string]: {
      value: string;
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => void;
      //   value: string | string[] | File | null | undefined;
      //   onChange: (value: string | string[] | File | null | undefined) => void;
    };
  }
] => {
  const [formData, setFormData] = useLocalStorage<FormData>(
    key,
    initialFormData
  );

  const reset = () => setFormData(initialFormData);

  const attributeObj: any = {};

  // Iterate over each key in initialFormData and create attribute objects for each key
  Object.keys(initialFormData).forEach((field) => {
    attributeObj[field] = {
      value: formData[field],
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) =>
        setFormData((prevData) => ({
          ...prevData,
          [field]: e.target.value,
        })),
      //   onChange: (value: string | string[] | File | null | undefined) => {
      //     setFormData((prevData) => ({
      //       ...prevData,
      //       [field]: value,
      //     }));
      //   },
    };
  });

  return [formData, reset, attributeObj];
};

export default useFormInput;
