import { useInfiniteQuery, useQuery } from "react-query";
import {
  fetchDesignByID,
  fetchDesigns,
} from "../../lib/supabase/queries/designs";
import { fetchDynamicDesigns } from "../../lib/supabase/queries/usefetchDesigns";
import { Design } from "@/types/types";
import { filterUniqueDesigns } from "@/util/data.util";

const pageSize = 8;
type InfiniteData<T> = {
  pages: T[];
  pageParams: unknown[];
};


export const useSynchronizeDesigns = (
  category?: string,
  filternames?: string[]
) => {
  return useInfiniteQuery(
    "synchronizedesignsSimilar",
    ({ pageParam = 1 }) =>
      fetchDesigns(pageParam, pageSize, category, filternames),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.length! < pageSize) return [];
        return allPages.length + 1;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    }
  );
};

export const useSynchronizeDynamicDesigns = (
  category?: string,
  filternames?: string[],
  searchTerm?: string
) => {
  return useInfiniteQuery(
    "synchronizedesignsDynamic",
    ({ pageParam = 1 }) =>
      fetchDynamicDesigns(pageParam, pageSize, category, filternames,searchTerm),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.length! < pageSize) return [];
        return allPages.length + 1;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      select: (data: InfiniteData<Design[] | []>) => {
        const allDesigns = data.pages.flatMap((page) => page);
        const uniqueDesigns = filterUniqueDesigns(allDesigns);
        return {
          pages: [uniqueDesigns], // Wrap in an array to maintain InfiniteData structure
          pageParams: data.pageParams,
        };
      },
    }
  );
};


export const useDesignByID = (id: string) => {
  return useQuery<Design | null>(
    ["designdetail", id],
    () => fetchDesignByID(id),
    {
      enabled: !!id, // Query will not execute until the ID exists
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    }
  );
};
