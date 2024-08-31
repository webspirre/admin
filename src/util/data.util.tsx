import { DesignDatabase } from "@/types/types_db";

const tabs = [
  { value: "all", label: "All" },
  { value: "ai", label: "AI" },
  { value: "fintech", label: "Fintech" },
  { value: "marketplace", label: "Marketplace" },
  { value: "e-commerce", label: "E-commerce" },
  { value: "crypto-web3", label: "Crypto & Web 3" },
  { value: "software-saas", label: "Software & SaaS" },
  { value: "travel-hospitality", label: "Travel & Hospitality" },
  { value: "agency-corporate", label: "Agency & Corporate" },
  { value: "devTools", label: "Developer Tools" },
  { value: "design-resources", label: "Design Resources" },
  { value: "others", label: "Others" },
];

const pageTypes = [
  { value: "landing", label: "Landing page" },
  { value: "pricing", label: "Pricing page" },
  { value: "about", label: "About page" },
  { value: "login", label: "Login page" },
  { value: "signup", label: "Sign up page" },
  { value: "404", label: "404 page" },
];

type Design = DesignDatabase["webspirre_admin"]["Tables"]["website"]["Row"];

const isValidCategory = (category: string) => {
  return tabs.some((tab) => tab.value === category);
};

const getPageType = (category: string) => {
  return pageTypes.find((pageType) => pageType.value === category);
};

const processCategories = (categories: string[]) => {
  categories.forEach((category) => {
    if (isValidCategory(category)) {
      const pageType = getPageType(category);
      console.log(pageType); // Or do something else with the pageType
    } else {
      console.error(`${category} is not a valid page type`);
      if (typeof window !== "undefined") {
        window.location.href = "/not-found";
      }
      return null;
    }
  });
};

const isValidPageType = (pageType: string) => {
  return pageTypes.some((type) => type.value === pageType);
};

const processPageTypes = (pageTypesList: string[]) => {
  pageTypesList.forEach((pageType) => {
    if (!isValidPageType(pageType)) {
      console.error(`${pageType} is not a valid page type`);
      if (typeof window !== "undefined") {
        window.location.href = "/not-found";
      }
      return null;
    }
  });
  // If all pageTypes are valid, you can handle the valid pageTypes here
};

const useFilteredPagetypeValues = (selectedFilters: string[]) => {
  if (selectedFilters.length > 0) {
    let filterString = "";
    // console.log("selectedFiltered Values", selectedFilters);
    selectedFilters.forEach((filter, index) => {
      const prefix = index === 0 ? "" : "_";
      filterString += `${prefix}pageType.${filter}`;
    });

    return filterString;
  }
};

const setFilterParams = (filterParams: string[]): string[] => {
  let selectedFilters: string[] = [];

  filterParams.forEach((filter) => {
    const parts = filter.split(".");
    if (parts.length > 1 && parts[0] === "pageType") {
      const newFilter = parts[1]; // get the second part directly
      if (!selectedFilters.includes(newFilter)) {
        selectedFilters.push(newFilter);
      }
    }
  });

  // Sort filters to ensure consistent ordering
  return selectedFilters.sort();
};

const getFilterParams = (query: string): string[] => {
  const filterParams = query.split("?")[1].split("_");
  return setFilterParams(filterParams);
};

function getCategoryNameFromQuery(queryString: string): string | undefined {
  try {
    // Use URL constructor to parse the query string
    const url = new URL(queryString);
    console.log("url", url);
    const pathname = url.pathname;

    // Extract 'category' from the pathname
    const parts = pathname.split("/");
    const categoryIndex = parts.indexOf("category");

    // Return the next part in the path after 'category'
    if (categoryIndex !== -1 && parts[categoryIndex + 1]) {
      return parts[categoryIndex + 1];
    }

    return undefined; // 'category' was not found or there is no subsequent part
  } catch (error) {
    console.error("Invalid query string:", error);
    return undefined;
  }
}

const getMainDesigns = (allDesigns: any[], categoryName: string) => {
  // If categoryName is "all", return all designs
  if (categoryName.toLowerCase() === "all") {
    return allDesigns;
  }

  // Check if the categoryName is a valid non-empty string
  if (typeof categoryName !== "string" || categoryName.trim() === "") {
    return allDesigns;
  }

  // Filter designs based on the provided category name
  const filteredDesigns = allDesigns.filter(
    (design) => design.categories && design.categories.includes(categoryName)
  );

  // If no designs match the category, return an empty array
  return filteredDesigns.length > 0 ? filteredDesigns : [];
};

const filterByPageTypes = (designs: any[], pageTypes: string[]) => {
  if (!designs || !pageTypes || pageTypes.length === 0) {
    return designs;
  }

  return designs.filter((design) => pageTypes.includes(design.pageType));
};

const getSimilarDesigns = (allDesigns: any[], categoryNames: string[]) => {
  // If no categories are passed, return all designs
  if (categoryNames.length === 0) {
    return allDesigns;
  }

  // Filter designs based on the provided category names
  const filteredDesigns = allDesigns.filter(
    (design) =>
      design.categories &&
      categoryNames.some((category) => design?.categories.includes(category))
  );

  // If no designs match the categories, return an empty array
  return filteredDesigns.length > 0 ? filteredDesigns : [];
};

const shuffleArray = (array: Design[]): Design[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const filterOutOption = (
  option: { value: string },
  pageTypes: string[]
): string[] => {
  return pageTypes.filter((type) => type !== option.value);
};

export const generateFilteredURLAndRoute = (
  option: { value: string; label: string },
  pageTypes: string[],
  router: any,
  categoryId: string
) => {
  // Filter out the option.value from pageTypes
  const filteredPageTypes = pageTypes.filter((type) => type !== option.value);

  // Generate the filtered URL
  let filteredURL = "";
  if (pageTypes.length > 0) {
    pageTypes.forEach((type, index) => {
      const prefix = index === 0 ? "" : "_";
      filteredURL += `${prefix}pageType.${type}`;
    });
  }

  // Determine the route
  let route = "/";
  if (categoryId && isValidCategory(categoryId)) {
    if (filteredURL) {
      route = `/dashboard/content/category/${categoryId}/pagetypes/pagetype?${filteredURL}`;
    } else {
      route = `/dashboard/content/category/${categoryId}`;
    }
  } else if (pageTypes.length > 0) {
    route = `/dashboard/content/pagetypes/pagetype?${filteredURL}`;
  }

  router.push(route);
};

const formatCategoryOptions = (selectedCategories: string[]) => {
  return selectedCategories.map((category) => {
    const label = category
      .replace(/-/g, " ") // Replace hyphens with spaces
      .replace(/\b\w/g, (word) => word.toUpperCase()) // Capitalize first letter of each word
      .replace(/\s\w/g, (word) => " " + word.toUpperCase()) // Capitalize first letter of each word after space
      .replace(/\s(?=\w+$)/g, " & "); // Add ampersand before the last word
    return { value: category, label };
  });
};

const formatPageTypeOption = (category: string) => {
  const label = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (word) => word.toUpperCase())
    .replace(/\s\w/g, (word) => " " + word.toUpperCase())
    .replace(/\s(?=\w+$)/g, " & ");
  return { value: category, label };
};

/**
 * Removes duplicate designs based on uid.
 * @param {Design[] | []} designs - Array of design objects.
 * @returns {Design[]} - Array of unique design objects.
 */
const filterUniqueDesigns = (designs: Design[] | []) => {
  const seenUids = new Set();
  return designs.filter((design) => {
    if (seenUids.has(design.uid)) {
      return false;
    } else {
      seenUids.add(design.uid);
      return true;
    }
  });
};

export {
  tabs,
  isValidCategory,
  pageTypes,
  useFilteredPagetypeValues,
  setFilterParams,
  getFilterParams,
  processCategories,
  getCategoryNameFromQuery,
  processPageTypes,
  getMainDesigns,
  shuffleArray,
  filterByPageTypes,
  getSimilarDesigns,
  formatCategoryOptions,
  formatPageTypeOption,
  filterUniqueDesigns,
};
