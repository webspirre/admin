"use client";
// "use server";

import Image from "next/image";
import { ChangeEvent, FormEvent, useState, useRef, useEffect, FC } from "react";
import FileUpload from "./FileUpload";
import cloudinary from "@/libs/cloudinary";
import { supabase } from "@/libs/supabase";
// import { create } from "../../actions/create";
import toast from "react-hot-toast";

import Select, { ActionMeta, MultiValue } from "react-select";

import { CloudinaryAsset, FormData as MyFormData } from "@/types/types";

const categories_: Option[] = [
  { value: "ai", label: "AI" },
  { value: "fintech", label: "Fintech" },
  { value: "marketplace", label: "Marketplace" },
  { value: "e-commerce", label: "E-commerce" },
  { value: "crypto-web3", label: "Crypto & Web 3" },
  { value: "software-saas", label: "Software & SaaS" },
  { value: "travel-hospitality", label: "Travel & Hospitality" },
  { value: "agency-corporate", label: "Agency & Corporate" },
];

const pageTypes_: Option[] = [
  { value: "landing", label: "Landing page" },
  { value: "pricing", label: "Pricing page" },
  { value: "about", label: "About page" },
  { value: "login", label: "Login page" },
  { value: "signup", label: "Sign up page" },
  { value: "404", label: "404 page" },
];

interface Option {
  value: string;
  label: string;
}

interface Map {
  [key: string]: string | string[] | undefined | Option | Option[];
}

const initialFormData: Map = {
  name: "",
  webURL: "",
  category: "",
  categories: [],
  pageType: "",
  shortDescription: "",
  longDescription: "",
  logoImageURL: "",
  desktopSsURL: "",
  mobileSsURL: "",
  desktopFpURL: "",
  mobileFpURL: "",
  date: new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  }),
};

const Form: FC<{ handleLoading: () => void; loading: boolean }> = ({
  handleLoading,
}) => {
  const [formData, setFormData] = useState(initialFormData);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen1, setIsOpen1] = useState(false);
  const [selectedPageTypes1, setSelectedPageTypes1] = useState<string[]>([]);
  const dropdownRef1 = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState<Option>();

  // Function to handle page type change
  const handleChangePageType = (selectedOption: Option | null) => {
    if (selectedOption) {
      setFormData({ ...formData, pageType: selectedOption.value });
      setSelectedOption(selectedOption);
    }
  };

  // Function to handle category change

 const handleCategoriesChange_ = (
    newValue: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    if (newValue) {
      const categoryValues = newValue.map((option) => option.value);
      setFormData({ ...formData, categories: categoryValues });
      setSelectedCategories(newValue as Option[]);
    }
  };

  useEffect(() => {
    // const currentDate = new Date().toLocaleString("en-US", {
    //   month: "long",
    //   year: "numeric",
    // });
    const currentDate = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Example output: "2024-04-12 14:30:00"

    setFormData((prevFormData) => ({
      ...prevFormData,
      date: currentDate,
    }));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * handleFileChange
   * @description Triggers when the file input changes (ex: when a file is selected)
   */

  const handleFileChange = async (
    file: File,
    type: string,
    filename: string
  ) => {
    setFormData({
      ...formData,
      // [type]: file,
      [type]: file as unknown as string,
    });
    const formDataForCloudinary = new FormData();

    // Upload images to Cloudinary
    if (file) formDataForCloudinary.append("file", file);

    formDataForCloudinary.append("upload_preset", "webspirre");

    try {
      handleLoading();
      const cloudinaryResponse: CloudinaryAsset = await fetch(
        "https://api.cloudinary.com/v1_1/dwqantex4/image/upload",
        {
          method: "POST",
          body: formDataForCloudinary,
        }
      ).then((r) => r.json());

      console.log("data", cloudinaryResponse);
      setFormData({
        ...formData,
        [type]: file as unknown as string,
        [filename]: cloudinaryResponse.secure_url,
      });

      toast.success(`${filename} link generated`, { duration: 3000 });
      console.log("new formDa", formData);
      handleLoading();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleCloudinaryFileChange = async (file: File, type: string) => {};

  /**
   * handleOnSubmit
   * @description Triggers when the main form is submitted
   */
  async function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formDataForCloudinary = new FormData();
    const formDataForSupabase: Map = {
      ...formData,
    };

    // Upload images to Cloudinary
    // const formDataKeys: (keyof FormData)[] = ['logoImageURL', 'desktopSsURL', 'mobileSsURL', 'desktopFpURL', 'mobileFpURL'];
    for (const fieldName in formData) {
      if (formData.hasOwnProperty(fieldName)) {
        const imageUrl = formData[fieldName];
        if (imageUrl) {
          formDataForCloudinary.append("file", imageUrl as string);
          // Clear the URL after upload to avoid redundant uploads
          formDataForSupabase[fieldName] = "";
        }
      }
    }

    formDataForCloudinary.append("upload_preset", "webspirre");

    try {
      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dwqantex4/image/upload",
        {
          method: "POST",
          body: formDataForCloudinary,
        }
      ).then((r) => r.json());

      console.log("data", cloudinaryResponse);

      // Update formData with Cloudinary URLs
      for (const fieldName in cloudinaryResponse) {
        if (cloudinaryResponse.hasOwnProperty(fieldName)) {
          const fieldValue = cloudinaryResponse[fieldName];
          if (fieldValue) {
            formDataForSupabase[fieldName] = fieldValue;
          }
        }
      }

      // Insert formData into Supabase
      const { data, error } = await supabase
        .from("website.website")
        .insert([formDataForSupabase])
        .select();

      // Handle errors
      if (error) {
        console.error("Error inserting data into Supabase:", error.message);
        return;
      }

      // Handle success
      console.log("Data inserted into Supabase:", data);
      setFormData(initialFormData); // Clear the form fields after successful submission
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const addWebsiteHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // await addWebsite(formData);
    try {
      // Destructure formData object
      const {
        name,
        webURL,
        category,
        pageType,
        shortDescription,
        longDescription,
        logoImageURL,
        desktopSsURL,
        mobileSsURL,
        desktopFpURL,
        mobileFpURL,
        categories,
        date,
      } = formData;
      // Insert formData into Supabase
      const { data, error } = await supabase
        .from("website")
        // .from("website.website")
        // .insert([formData])
        .insert([
          {
            name,
            webURL,
            category,
            pageType,
            shortDescription,
            longDescription,
            logoImageURL,
            desktopSsURL,
            mobileSsURL,
            desktopFpURL,
            mobileFpURL,
            date,
            categories,
          },
        ])
        .select();

      // Handle errors
      if (error) {
        console.error("Error inserting data into Supabase:", error.message);
        return;
      }

      // Handle success
      console.log("Data inserted into Supabase:", data);
      console.log("selecca", formData);
      setFormData(initialFormData); // Clear the form fields after successful submission
      toast.success("Document Created successfully!", { duration: 3000 });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-4 rounded-[20px] w-full m-4 bg-white">
      <div className="border-b">
        <p className="py-2 border-b-4 border-black text-center w-fit px-6">
          Upload details
        </p>
      </div>
      <form onSubmit={addWebsiteHandler}>
        <div className="grid grid-cols-2 gap-20 w-full text-slate-700">
          <div className=" ">
            <div className="w-full py-8">
              <label htmlFor="name">Name of website</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Name"
                onChange={handleChange}
                className="border-2 rounded-lg p-4 w-full"
              />
            </div>
            <div className="w-full py-8">
              <label htmlFor="webURL">URL of website</label>

              <input
                type="text"
                name="webURL"
                required
                placeholder="Website URL"
                onChange={handleChange}
                className="border-2 rounded-lg p-4 w-full"
              />
            </div>

            {/*  Category Field*/}

            <div className="w-full py-8">
              <h2>Select a Category:</h2>
              <Select
                value={selectedCategories}
                name="categories"
                onChange={handleCategoriesChange_}
                options={categories_}
                placeholder="Select Category..."
                isMulti
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    height: "60px",
                    width: "100%", // Customize width as needed
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? "#007bff" : "white", // Change background color of selected option
                    color: state.isSelected ? "white" : "black", // Change text color of selected option
                  }),
                }}
              />
              {/* {selectedCategories && (
                <div className="p-20">
                  <h3>Selected Category:</h3>
                  <p>
                    {selectedCategories.map((_) => (
                      <>{_.label} </>
                    ))}
                  </p>
                </div>
              )} */}
            </div>

            {/* PageType Field */}

            <div className="w-full py-8">
              <h2>Select a PageType:</h2>
              <Select
                name="pageType"
                value={selectedOption}
                onChange={handleChangePageType}
                options={pageTypes_}
                placeholder="Select PageType..."
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    height: "60px",
                    width: "100%", // Customize width as needed
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? "#007bff" : "white", // Change background color of selected option
                    color: state.isSelected ? "white" : "black", // Change text color of selected option
                  }),
                }}
              />
              {/* {selectedOption && (
                <div className="p-20">
                  <h3>Selected PageType:</h3>
                  <p>{selectedOption.label}</p>
                </div>
              )} */}
            </div>

            <div className="w-full py-8">
              <label htmlFor="shortDescription">Short Discription</label>

              <textarea
                name="shortDescription"
                placeholder="Short Description"
                onChange={handleChange}
                className="border-2 rounded-lg p-4 w-full"
              />
            </div>
            <div className="w-full py-8">
              <label htmlFor="longDescription">Long description</label>

              <textarea
                name="longDescription"
                placeholder="Long Description"
                onChange={handleChange}
                className="border-2 rounded-lg p-4 w-full"
              />
            </div>
          </div>
          <div className="">
            <div>
              <FileUpload
                label="Logo"
                onFileChange={(file) =>
                  handleFileChange(file, "logo", "logoImageURL")
                }
                onCloudinaryFileChange={(file) =>
                  handleCloudinaryFileChange(file, "logo")
                }
                filename={"logoImageURL"}
              />
              <FileUpload
                label="Desktop screenshot"
                onFileChange={(file) =>
                  handleFileChange(file, "desktopSs", "desktopSsURL")
                }
                onCloudinaryFileChange={(file) =>
                  handleCloudinaryFileChange(file, "desktopSs")
                }
                filename={"desktopSsURL"}
              />
              <FileUpload
                label="Mobile screenshot"
                onFileChange={(file) =>
                  handleFileChange(file, "mobileSs", "mobileSsURL")
                }
                onCloudinaryFileChange={(file) =>
                  handleCloudinaryFileChange(file, "mobileSs")
                }
                filename={"mobileSsURL"}
              />
              <FileUpload
                label="Desktop full page"
                onFileChange={(file) =>
                  handleFileChange(file, "desktopFp", "desktopFpURL")
                }
                onCloudinaryFileChange={(file) =>
                  handleCloudinaryFileChange(file, "desktopFp")
                }
                filename={"desktopFpURL"}
              />
              <FileUpload
                label="Mobile full page"
                onFileChange={(file) =>
                  handleFileChange(file, "mobileFp", "mobileFpURL")
                }
                onCloudinaryFileChange={(file) =>
                  handleCloudinaryFileChange(file, "mobileFp")
                }
                filename={"mobileFpURL"}
              />
            </div>
            <div className="w-full py-8">
              <label htmlFor="date">Date updated</label>
              <input
                type="text"
                name="date"
                placeholder="Date updated"
                value={formData.date as string}
                onChange={handleChange}
                className="border-2 rounded-lg p-4 w-full"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end m-4">
          <button
            type="submit"
            className="bg-black text-white px-[50px] py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
