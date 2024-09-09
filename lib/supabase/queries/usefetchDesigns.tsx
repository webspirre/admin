import { DesignDatabase, Map } from "@/types/types_db";
import {
  filterByPageTypes,
  getMainDesigns,
  isValidCategory,
} from "@/util/data.util";
import { createClient } from "../client";

type Design = DesignDatabase["webspirre_admin"]["Tables"]["website"]["Row"];

export const fetchDynamicDesigns = async (
  page: number,
  pageSize: number,
  category?: string,
  filternames?: string[],
  searchTerm?: string
): Promise<Design[] | []> => {
  // Check if arguments are provided
  if (page === undefined || pageSize === undefined) {
    console.error("Missing arguments: page and pageSize are required");
    return [];
  }

  // Check if category is valid
  if (category && !isValidCategory(category)) {
    console.error("Invalid category:", category);
    if (typeof window !== "undefined") {
      window.location.href = "/not-found";
    }
    return [];
  }

  const supabase = createClient();
  let filteredUIDs: string[] | null | (Map | undefined)[] = null;

  // Apply search filter if searchTerm is provided before executing the main query
  if (searchTerm) {
    const nameSearch = supabase
      .schema("webspirre_admin")
      .from("website")
      .select("uid")
      .textSearch("name", searchTerm, { type: "websearch", config: "english" });

    const descriptionSearch = supabase
      .schema("webspirre_admin")
      .from("website")
      .select("uid")
      .textSearch("shortDescription", searchTerm, {
        type: "websearch",
        config: "english",
      });

    // Run search queries in parallel
    const [nameResult, descriptionResult] = await Promise.all([
      nameSearch,
      descriptionSearch,
    ]);

    // Check for errors in any of the search queries
    if (nameResult.error || descriptionResult.error) {
      console.error(
        nameResult.error?.message || descriptionResult.error?.message
      );
      return [];
    }

    // Combine results and remove duplicates
    const combinedResults = [...nameResult.data!, ...descriptionResult.data!];

    const uniqueUIDs = Array.from(
      new Set(combinedResults.map((item) => item.uid))
    );

    // If search results are found, assign them to the filteredUIDs variable
    if (uniqueUIDs.length > 0) {
      filteredUIDs = uniqueUIDs;
    }
  }

  // Proceed with the main design query
  let designQuery = supabase
    .schema("webspirre_admin")
    .from("website")
    .select("*")
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order("created_at", { ascending: false }); // Sort by newest

  // If filteredUIDs exist from the search, apply it to the query
  if (filteredUIDs) {
    designQuery = designQuery.in("uid", filteredUIDs);
  }

  // Apply category filter if provided and not equal to "all"
  if (category && category.toLowerCase() !== "all") {
    designQuery = designQuery.contains("categories", [category]);
  }

  // Apply page type filters (filternames) if provided
  if (filternames && filternames.length > 0) {
    designQuery = designQuery.in("pageType", filternames);
  }

  // Execute the final query
  const { data, error } = await designQuery;

  if (error) {
    console.error("Error fetching designs:", error);
    return [];
  }

  // Filter and return the designs
  const pureDesigns = getMainDesigns(data, category!);
  const finalFilteredDesigns = filterByPageTypes(pureDesigns, filternames!);

  return finalFilteredDesigns as Design[] | [];
};
