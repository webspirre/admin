import { DesignDatabase } from "@/types/types_db";
import { unstable_cache } from "next/cache";

import {
  filterByPageTypes,
  getMainDesigns,
  isValidCategory,
  shuffleArray,
} from "@/util/data.util";
import { createClient } from "../client";

type Design = DesignDatabase["webspirre_admin"]["Tables"]["website"]["Row"];

export const fetchDesigns = async (
  page: number,
  pageSize: number,
  category?: string,
  filternames?: string[]
): Promise<Design[] | []> => {
  // Check if arguments are provided
  if (page === undefined || pageSize === undefined) {
    console.error(
      "Missing arguments: isSaved, page, and pageSize are required"
    );
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

  // Execute the query
  const { data, error } = await designQuery;

  if (error) {
    console.error("Error fetching designs:", error);
    return [];
  }

  const pureDesigns = getMainDesigns(data, category!);
  const finalFilteredDesigns = filterByPageTypes(pureDesigns, filternames!);

  return shuffleArray(finalFilteredDesigns) as Design[] | [];
};

export const fetchDesignByID = async (id: string): Promise<Design | null> => {
  if (!id) {
    console.warn("No ID provided. Exiting fetchDesignByID function.");
    return null;
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .schema("webspirre_admin")
    .from("website")
    .select()
    .eq("uid", id)
    .single();

  if (error) {
    console.error("Error fetching design detail:", error);
    return null;
  }

  return data as Design | null;
};


export const getCachedDesignById = unstable_cache(
  async (id: string): Promise<Design | null> => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("website")
      .select()
      .eq("uid", id)
      .single();

    if (error || !data) {
      console.error("Error fetching design:", error);
      return null;
    }

    return data as Design;
  },
  [
    /* Cache key dependencies here, like 'id' */
  ]
);

export const deleteDesign = async (id: string): Promise<boolean> => {
  if (!id) {
    console.warn("No ID provided. Exiting deleteDesign function.");
    return false;
  }
  const supabase = createClient();
  const { error } = await supabase
    .schema("webspirre_admin")
    .from("website")
    .delete()
    .eq("uid", id)
    .single();

  if (error) {
    console.error("Error deleting design:", error);
    return false;
  }

  return true;
};

export const deleteMultipleDesigns = async (ids: string[]): Promise<boolean> => {
  if (!ids || ids.length === 0) {
    console.warn("No IDs provided. Exiting deleteMultipleDesigns function.");
    return false;
  }
  const supabase = createClient();
  const { error } = await supabase
    .schema("webspirre_admin")
    .from("website")
    .delete()
    .in("uid", ids);

  if (error) {
    console.error("Error deleting multiple designs:", error);
    return false;
  }

  return true;
};