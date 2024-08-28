"use client";

import { useState, useEffect, FC } from "react";
import FileUpload from "./FileUpload";
import toast from "react-hot-toast";

import Select, { ActionMeta, MultiValue } from "react-select";

import { CloudinaryAsset } from "@/types/types";
import { createClient } from "../../../lib/supabase/client";
import SuccessModal from "@/components/modal/UploadSuccessModal";
import { ImagePreviewState } from "@/types/imgPreview.type";
import SubmitButton from "@/components/ui/SubmitButton";
import ErrorMessage from "@/components/ui/ErrorMessage";

const categories_: Option[] = [
  { value: "ai", label: "AI" },
  { value: "fintech", label: "Fintech" },
  { value: "marketplace", label: "Marketplace" },
  { value: "e-commerce", label: "E-commerce" },
  { value: "crypto-web3", label: "Crypto & Web 3" },
  { value: "software-saas", label: "Software & SaaS" },
  { value: "travel-hospitality", label: "Travel & Hospitality" },
  { value: "agency-corporate", label: "Agency & Corporate" },
  { value: "devTools", label: "Developer Tools" },
  { value: "others", label: "Others" },
  { value: "design-resources", label: "Design Resources" },
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

interface ErrorMap {
  [key: string]: string | string[];
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
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
};

const initialErrorData: ErrorMap = {
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
  date: "",
};

const Form: FC<{ handleLoading: () => void; loading?: boolean }> = ({
  handleLoading,
  loading,
}) => {
  const supabase = createClient();
  const [formData, setFormData] = useState(initialFormData);
  const [errorData, setErrorData] = useState(initialErrorData);

  /// FILEUPLOAD STATES
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<ImagePreviewState>({
    desktopFpURL: null,
    mobileFpURL: null,
    logoImageURL: null,
  });
  const [loadingState, setLoadingState] = useState({
    desktopFpURL: false,
    mobileFpURL: false,
    logoImageURL: false,
  });

  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toogleModal, setToogleModal] = useState(false);

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }

    const savedCategories = localStorage.getItem("selectedCategories");
    if (savedCategories) {
      setSelectedCategories(JSON.parse(savedCategories));
    }

    const savedPageType = localStorage.getItem("selectedPageType");
    if (savedPageType) {
      setSelectedOption(JSON.parse(savedPageType));
    }
  }, []);

  // Function to handle page type change
  const handleChangePageType = (selectedOption: Option | null) => {
    // if (selectedOption) {
    //   setFormData({ ...formData, pageType: selectedOption.value });
    //   setSelectedOption(selectedOption);
    // }
    if (selectedOption) {
      const newFormData = {
        ...formData,
        pageType: selectedOption.value,
      };
      setFormData(newFormData);
      setSelectedOption(selectedOption);
      localStorage.setItem("formData", JSON.stringify(newFormData));
      localStorage.setItem("selectedPageType", JSON.stringify(selectedOption));
    }
  };

  // Function to handle category change

  const handleCategoriesChange_ = (
    newValue: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    if (newValue) {
      const categoryValues = newValue.map((option) => option.value);
      const newFormData = {
        ...formData,
        categories: categoryValues,
      };
      setFormData(newFormData);
      setSelectedCategories(newValue as Option[]);
      localStorage.setItem("formData", JSON.stringify(newFormData));
      localStorage.setItem("selectedCategories", JSON.stringify(newValue));
    }
  };

  const resetCurrentDate = () => {
    const currentDate = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return currentDate;
  };
  useEffect(() => {
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
    const { name, value } = e.target;
    let errorMessage = "";

    // Basic validation checks
    if (name === "name" && value.length < 3) {
      errorMessage = "Name must be at least 3 characters";
    } else if (name === "webURL" && !/https?:\/\/\S/.test(value)) {
      errorMessage = "Invalid URL";
    } else if (name === "shortDescription" && value.length > 200) {
      errorMessage = "Short description must be less than 100 characters";
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrorData({
      ...errorData,
      [name]: errorMessage,
    });

    localStorage.setItem("formData", JSON.stringify(formData));
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
    // Validate input and update errorData accordingly
    if (type === "name" && file.size < 3) {
      setErrorData({
        ...errorData,
        [type]: "Name must be at least 3 characters",
      });
    } else {
      setErrorData({ ...errorData, [type]: "" });
    }
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
      setLoadingState((prevState) => ({ ...prevState, [filename]: true }));
      const cloudinaryResponse: CloudinaryAsset = await fetch(
        "https://api.cloudinary.com/v1_1/dwqantex4/image/upload",
        {
          method: "POST",
          body: formDataForCloudinary,
        }
      ).then((r) => r.json());

      // console.log("data", cloudinaryResponse);

      setFormData((prevState) => {
        const updatedFormData = {
          ...prevState,
          [type]: file as unknown as string,
          [filename]: cloudinaryResponse.secure_url,
        };
        localStorage.setItem("formData", JSON.stringify(updatedFormData));
        return updatedFormData;
      });
      toast.success(`${filename} link generated`, { duration: 3000 });
      // console.log("new formDa", formData);
      handleLoading();
      setTimeout(() => {
        setLoadingState((prevState) => ({ ...prevState, [filename]: false }));
      }, 2000); // Simulate upload delay
    } catch (error) {
      console.error("Error:", error);
    }
  };

  /**
   * handleOnSubmit
   * @description Triggers when the main form is submitted
   */

  const addWebsiteHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true); // Set loading state to true

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
      // @ts-ignore
      const { data, error } = await supabase
        .schema("webspirre_admin")
        .from("website")
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

      const { data: RecoveryData, error: RecoveryError } = await supabase
        .schema("webspirre_admin")
        .from("website_recovery")
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
      if (error || RecoveryError) {
        console.error(
          "Error inserting data into Supabase:",
          error?.message,
          RecoveryError?.message
        );
        return;
      }

      // Handle success
      // console.log("Data inserted into Supabase:", data);

      setFormData({ ...formData, ...initialFormData }); // Clear the form fields after successful submission
      localStorage.removeItem("formData");
      localStorage.removeItem("selectedCategories");
      localStorage.removeItem("selectedPageType");
      localStorage.removeitem('file-desktopFpURL')
      localStorage.removeitem('file-mobileFpURL')
      localStorage.removeitem('file-logoImageURL')

      toast.success("Document Created successfully!", { duration: 3000 });
      setIsSubmitting(false); // Set loading state to false after request completes
      setFormData(initialFormData); // Clear the form fields after successful submission
      setSelectedCategories([]); // Clear selected categories
      // @ts-ignore
      setSelectedOption(null); // Clear selected page type
      resetCurrentDate();
      setToogleModal((prev) => !prev);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const resetImagePreviews = () => {
    setImagePreview({
      desktopFpURL: null,
      mobileFpURL: null,
      logoImageURL: null,
    });
    setToogleModal((prev) => !prev);
  };

  return (
    <>
      <SuccessModal
        open={toogleModal}
        toogleModal={() => setToogleModal((prev) => !prev)}
        setPreview={resetImagePreviews}
      />
      <div className="p-4 rounded-[20px] w-full m-4 bg-white">
        <div className="border-b">
          <p className="py-2 border-b-4 border-black text-center w-fit px-6">
            Upload details
          </p>
        </div>
        <form
          onSubmit={addWebsiteHandler}
          // onSubmit={handleSubmit}
        >
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
                  value={formData.name as string}
                  // {...inputAttributes.name}
                  className="border-2 rounded-lg p-4 w-full"
                />
                <ErrorMessage message={errorData.name as string} />
              </div>
              <div className="w-full py-8">
                <label htmlFor="webURL">URL of website</label>

                <input
                  // {...inputAttributes.webURL}
                  type="text"
                  name="webURL"
                  required
                  placeholder="Website URL"
                  onChange={handleChange}
                  value={formData.webURL as string}
                  className="border-2 rounded-lg p-4 w-full"
                />
                <ErrorMessage message={errorData.webURL as string} />
              </div>

              {/*  Category Field*/}

              <div className="w-full py-8">
                <h2>Select Categories:</h2>
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
              </div>

              <div className="w-full py-8">
                <label htmlFor="shortDescription">Short Discription</label>

                <textarea
                  name="shortDescription"
                  placeholder="Short Description"
                  onChange={handleChange}
                  value={formData.shortDescription as string}
                  // {...inputAttributes.shortDescription}
                  className="border-2 rounded-lg p-4 w-full"
                />
                <ErrorMessage message={errorData.shortDescription as string} />
              </div>
              <div className="w-full py-8">
                <label htmlFor="longDescription">Long description</label>

                <textarea
                  name="longDescription"
                  placeholder="Long Description"
                  onChange={handleChange}
                  value={formData.longDescription as string}
                  // {...inputAttributes.longDescription}
                  className="border-2 rounded-lg p-4 w-full"
                />
                <ErrorMessage message={errorData.longDescription as string} />
              </div>
            </div>
            <div className="">
              <div>
                <FileUpload
                  label="Logo"
                  onFileChange={(file) =>
                    handleFileChange(file, "logo", "logoImageURL")
                  }
                  filename={"logoImageURL"}
                  filesize="400px x 400px"
                  loading={loadingState.logoImageURL}
                  imagePreview={imagePreview.logoImageURL}
                  setImagePreview={setImagePreview}
                  errorMsg={errorData.logoImageURL as string}
                />
                <FileUpload
                  label="Desktop full page"
                  onFileChange={(file) =>
                    handleFileChange(file, "desktopFp", "desktopFpURL")
                  }
                  filename={"desktopFpURL"}
                  filesize="1440px x 900px"
                  loading={loadingState.desktopFpURL}
                  imagePreview={imagePreview.desktopFpURL}
                  setImagePreview={setImagePreview}
                  errorMsg={errorData.desktopFpURL as string}
                />
                <FileUpload
                  label="Mobile full page"
                  onFileChange={(file) =>
                    handleFileChange(file, "mobileFp", "mobileFpURL")
                  }
                  filename={"mobileFpURL"}
                  loading={loadingState.mobileFpURL}
                  filesize="812px x 414px"
                  imagePreview={imagePreview.mobileFpURL}
                  setImagePreview={setImagePreview}
                  errorMsg={errorData.mobileFpURL as string}
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
                  // {...inputAttributes.date}
                  className="border-2 rounded-lg p-4 w-full"
                />
                <ErrorMessage message={errorData.date as string} />
              </div>
            </div>
          </div>
          <div className="flex justify-end m-4">
            <SubmitButton isSubmitting={isSubmitting} formData={formData} />
          </div>
        </form>
      </div>
    </>
  );
};

export default Form;
