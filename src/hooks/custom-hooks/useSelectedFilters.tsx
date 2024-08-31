import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const useUpdateSelectedFilters = <T extends string>(
  pageTypes: T[],
  selectedFilters: T[],
  setSelectedFilters: (filters: T[]) => void
) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const pageType = searchParams.get("pageType") as T | null;

    if (pageType && pageTypes.includes(pageType)) {
      const updatedFilters = [...selectedFilters];
      if (!updatedFilters.includes(pageType)) {
        updatedFilters.push(pageType);
      }
      console.log("updatedFilters", updatedFilters);
      setSelectedFilters(updatedFilters);
    }
  }, [searchParams, pageTypes, selectedFilters]);
};

export default useUpdateSelectedFilters;
