import { useEffect } from "react";

const useClearFormStorage = () => {
  //   useEffect(() => {
  const clearStorage = () => {
    localStorage.removeItem("formData");
    localStorage.removeItem("selectedCategories");
    localStorage.removeItem("selectedPageType");
    localStorage.removeItem("file-desktopFpURL");
    localStorage.removeItem("file-mobileFpURL");
    localStorage.removeItem("file-logoImageURL");
  };

  // Call clearStorage when the component mounts or unmounts
  clearStorage();

  // Return clearStorage to be called manually if needed
  // return clearStorage;
  //   }, []);
};

export default useClearFormStorage;
