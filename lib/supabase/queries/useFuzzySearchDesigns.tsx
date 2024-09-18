import { DesignDatabase } from "@/types/types_db";
import { useQuery } from "react-query";
import { supabase } from "../client";

type Design = DesignDatabase["webspirre_admin"]["Tables"]["website"]["Row"];

const searchDesigns = async (searchTerm: string) => {
  // @ts-ignore
  const { data, error } = await supabase.rpc("fuzzy_search_websites", {
    search_term: searchTerm,
  });

  if (error) {
    console.error("Search Fuzzy error:", error);
  } else {
    return data || [];
  }
};

export const useWebspirreFuzzyDesignSearch = (searchTerm: string) => {
  return useQuery(
    ["searchedDesigns", searchTerm],
    () => searchDesigns(searchTerm),
    {
      enabled: !!searchTerm, // Only run query if searchTerm is provided
    }
  );
};
