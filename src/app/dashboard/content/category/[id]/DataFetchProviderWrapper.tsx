"use client";

import { DataFetchProvider } from "@/context/DataFetchProvider";
import { DesignActionProvider } from "@/context/DesignActionProvider";
import useGetSessionStorage from "@/hooks/custom-hooks/useGetSessionValue";
import React from "react";

const DataFetchProviderWrapper = ({
  children,
  categoryId,
}: {
  children: React.ReactNode;
  categoryId?: string;
}) => {
  const getSearchQueryFromSessionStorage = () => {
    return useGetSessionStorage<string>("searchQuery");
  };

  return (
    <DataFetchProvider
      categoryId={categoryId}
      searchQuery={getSearchQueryFromSessionStorage()}
    >
      <DesignActionProvider>{children}</DesignActionProvider>
    </DataFetchProvider>
  );
};

export default DataFetchProviderWrapper;
