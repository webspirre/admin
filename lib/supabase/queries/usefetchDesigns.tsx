import { DesignDatabase } from "@/types/types_db";
import {
  filterByPageTypes,
  getMainDesigns,
  isValidCategory,
  shuffleArray,
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
  let designQuery = supabase
    .schema("webspirre_admin")
    .from("website")
    .select("*")
    .range((page - 1) * pageSize, page * pageSize - 1);

  // Apply category filter if provided and not equal to "all"
  if (category && category.toLowerCase() !== "all") {
    designQuery = designQuery.contains("categories", [category]);
  }

  // Apply page type filters (filternames) if provided
  if (filternames && filternames.length > 0) {
    designQuery = designQuery.in("pageType", filternames);
  }

  // Apply search filter if searchTerm is provided
  if (searchTerm) {
    const nameSearch = supabase
      .schema("webspirre_admin")
      .from("website")
      .select("*")
      .textSearch("name", searchTerm, { type: "websearch", config: "english" });

    const descriptionSearch = supabase
      .schema("webspirre_admin")
      .from("website")
      .select("*")
      .textSearch("shortDescription", searchTerm, {
        type: "websearch",
        config: "english",
      });

    const bodySearch = supabase
      .schema("webspirre_admin")
      .from("website")
      .select("*")
      .textSearch("longDescription", searchTerm, {
        type: "websearch",
        config: "english",
      });

    const categorySearch = supabase
      .schema("webspirre_admin")
      .from("website")
      .select()
      .containedBy("categories", [searchTerm]);

    const [nameResult, descriptionResult, bodyResult, categoryResult] =
      await Promise.all([
        nameSearch,
        descriptionSearch,
        bodySearch,
        categorySearch,
      ]);

    // Check for errors in any of the search queries
    if (
      nameResult.error ||
      descriptionResult.error ||
      bodyResult.error ||
      categoryResult.error
    ) {
      console.error(
        nameResult.error?.message ||
          descriptionResult.error?.message ||
          bodyResult.error?.message ||
          categoryResult.error?.message
      );
      return [];
    }

    // Combine and remove duplicates from search results
    const combinedResults = [
      ...nameResult.data!,
      ...descriptionResult.data!,
      ...bodyResult.data!,
      ...categoryResult.data!,
    ];

    const uniqueResults = Array.from(
      new Set(combinedResults.map((item) => item.uid))
    ).map((id) => combinedResults.find((item) => item.uid === id));

    // console.log(uniqueResults);

    designQuery = supabase
      .schema("webspirre_admin")
      .from("website")
      .select("*")
      .in(
        "uid",
        uniqueResults.map((item) => item?.uid)
      );
  }

  // Execute the combined query
  const { data, error } = await designQuery;

  if (error) {
    console.error("Error fetching designs:", error);
    return [];
  }

  const pureDesigns = getMainDesigns(data, category!);
  const finalFilteredDesigns = filterByPageTypes(pureDesigns, filternames!);
  // console.log(finalFilteredDesigns);
  return shuffleArray(finalFilteredDesigns) as Design[] | [];
};
