"use client";

import React, { createContext, useState, useEffect, useMemo } from "react";
import {
  useDesignByID,
  useSynchronizeDesigns,
  useSynchronizeDynamicDesigns,
} from "@/hooks/useDesigns";
import { DesignDatabase } from "@/types/types_db";
import useGetSessionStorage from "@/hooks/custom-hooks/useGetSessionValue";
import { useTotalDesigns } from "@/hooks/custom-hooks/useTotalDesigns";

type Design = DesignDatabase["webspirre_admin"]["Tables"]["website"]["Row"];

export interface DataFetchContextType {
  Designs: Design[] | [];
  hasNextPage?: boolean;
  fetchNextPage(): void;
  isFetchingNextPage?: boolean;
  isLoading: boolean;
  refetch(): void;
  categoryId?: string;
  pageTypes?: string[];
  designByIdIsLoading?: boolean;
  detailDesign?: Design | null;
  totalDesigns?: any;
  TDisLoading?: boolean;
  currentPage?: number;
}

const DataFetchContext = createContext<DataFetchContextType | undefined>(
  undefined
);

interface DataFetchProviderProps {
  children: React.ReactNode;
  categoryId?: string;
  pageTypes?: string[];
  designId?: string;
  searchQuery?: string;
}

export const DataFetchProvider = ({
  children,
  categoryId = "all",
  pageTypes,
  designId,
  searchQuery,
}: DataFetchProviderProps) => {
  // const getSearchQueryFromSessionStorage = () => {
  //   return useGetSessionStorage<string>("searchQuery");
  // };

  const {
    data: smDlDesigns,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useSynchronizeDynamicDesigns(categoryId, pageTypes, searchQuery);
  const Designs = useMemo(
    () => (smDlDesigns && smDlDesigns!.pages.flatMap((page) => page)) || [],
    [smDlDesigns]
  );
  const currentPage = smDlDesigns?.pages.length || 1;
  const {
    data: totalDesigns,
    error: totalDesignsErr,
    isLoading: TDisLoading,
  } = useTotalDesigns();
  // console.log(smDlDesigns, Designs);

  const { data: dlDesign, isLoading: designByIdIsLoading } = useDesignByID(
    designId!
  );
  const detailDesign = useMemo(() => dlDesign || null, [dlDesign]);

  const categories = detailDesign?.categories ?? ([] as string[]);

  const value = {
    Designs,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    categoryId,
    pageTypes,
    designByIdIsLoading,
    detailDesign,
    totalDesigns,
    TDisLoading,
    currentPage,
  };

  return (
    <DataFetchContext.Provider value={value}>
      {children}
    </DataFetchContext.Provider>
  );
};

export default DataFetchContext;
