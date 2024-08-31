import { useRef, useEffect, ChangeEvent } from "react";
import { usePathname } from "next/navigation";
import useSessionStorage from "./useSessionStorage";

const useSearchInput = (router: any, refetch?: any) => {
  const [searchQuery, setSearchQuery] = useSessionStorage<string>(
    "searchQuery",
    ""
  );
  const pathname = usePathname();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    (setSearchQuery as (qr: string) => void)(query);
    updateURLWithSearchQuery(query, router);
  };

  const handleInputFocus = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleInputClear = () => {
    // (setSearchQuery as (qr: string) => void)("");
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  const updateURLWithSearchQuery = (searchQuery: string, router: any) => {
    const currentRoute = pathname;
    const newRoute = `${currentRoute}?queryResult=${searchQuery}`;
    router.push(newRoute);
    refetch();
  };

  return {
    searchQuery,
    searchInputRef,
    handleSearchChange,
    handleInputFocus,
    handleInputClear,
  };
};

export default useSearchInput;
