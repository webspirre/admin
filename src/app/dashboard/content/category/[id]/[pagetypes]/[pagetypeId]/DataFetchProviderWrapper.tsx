'use client'

import { DataFetchProvider } from "@/context/DataFetchProvider";
import useGetSessionStorage from "@/hooks/custom-hooks/useGetSessionValue";
import useAuth from "@/hooks/useAuth";
import { getCategoryNameFromQuery, getFilterParams } from "@/util/data.util";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const DataFetchProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const value = useGetSessionStorage("selectedFilters");
  const getSearchQueryFromSessionStorage = () => {
    return useGetSessionStorage<string>("searchQuery");
  };
  
  const [filterParams, setFilterParams] = useState<string[]>([]);
  const [filtercategory, setFilterCategory] = useState<string>();
  const { auth } = useAuth();

  React.useEffect(() => {
    const newUser = auth;
    if (!newUser) {
      return redirect("/");
    }
  }, [auth]);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlArray = getFilterParams(currentUrl);
    setFilterParams(urlArray);

    const categoryName = getCategoryNameFromQuery(currentUrl);
    setFilterCategory(categoryName);
  }, []);

  return (
    <DataFetchProvider
      pageTypes={value as string[]}
      categoryId={filtercategory && filtercategory}
      searchQuery={getSearchQueryFromSessionStorage()}
    >
      {children}
    </DataFetchProvider>
  );
};

export default DataFetchProviderWrapper;
