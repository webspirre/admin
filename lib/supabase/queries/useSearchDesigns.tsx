import { DesignDatabase } from "@/types/types_db";
import { useQuery } from "react-query";
import { supabase } from "../client";

type Design = DesignDatabase["webspirre_admin"]["Tables"]["website"]["Row"];

// Function to perform text search on multiple columns
const searchProducts = async (searchTerm: string) => {
  const queryLower = `%${searchTerm.toLowerCase()}%`;
  const nameSearch = await supabase
    .schema("webspirre_admin")
    .from("website")
    .select("*")
    .textSearch("name", searchTerm, { type: "websearch", config: "english" });

  const descriptionSearch = await supabase
    .schema("webspirre_admin")
    .from("website")
    .select("*")
    .textSearch("shortDescription", searchTerm, {
      type: "websearch",
      config: "english",
    });

  const bodySearch = await supabase
    .schema("webspirre_admin")
    .from("website")
    .select("*")
    .textSearch("longDescription", searchTerm, {
      type: "websearch",
      config: "english",
    });

  // Using cs to search within the categories array
  const categorySearch = await supabase
    .schema("webspirre_admin")
    .from("website")
    .select()
    // .filter("categories", "cs", [searchTerm]);
    .containedBy("categories", [searchTerm]);

  if (nameSearch.error || descriptionSearch.error || categorySearch.error) {
    throw new Error(
      nameSearch.error?.message ||
        descriptionSearch.error?.message ||
        categorySearch.error?.message
    );
  } else {
    const combinedResults = [
      ...nameSearch.data,
      ...descriptionSearch.data,
      ...categorySearch.data,
      ...bodySearch.data!,
    ];

    // Remove duplicates based on unique id
    const uniqueResults = Array.from(
      new Set(combinedResults.map((item) => item.uid))
    ).map((id) => combinedResults.find((item) => item.uid === id));

    return uniqueResults as Design[];
  }
};

// Custom hook using react-query
export const useWebspirreDesignSearch = (searchTerm: string) => {
  return useQuery(["products", searchTerm], () => searchProducts(searchTerm), {
    enabled: !!searchTerm, // Only run query if searchTerm is provided
  });
};
