"use client";

import { Design, AdminDesign } from "@/types/types";

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";
import { deleteMultipleDesigns } from "../../lib/supabase/queries/designs";
import { useWebspirreDesignSearch } from "../../lib/supabase/queries/useSearchDesigns";
import { useSearchParams } from "next/navigation";
import { cn } from "../../lib/cn";
import { useWebspirreFuzzyDesignSearch } from "../../lib/supabase/queries/useFuzzySearchDesigns";

// Define the type for the context
interface DesignActionContextType {
  isModalOpen: boolean;
  selectedDesignName: string;
  bulkSelectedRows: string[];
  individualSelectedRows: string[];
  handleDesignDelete: (designID: string, designName: string) => void;
  handleSelectAll: (Designs: Design[]) => void;
  handleSelect: (rowIndex: string) => void;
  handleDeleteAll: (refetch?: any) => void;
  handleBulkActionClick: () => void;
  selectedRowsLength: number;
  setIsModalOpen: (open: boolean) => void;
  dropdownRef?: React.RefObject<HTMLDivElement>;
  showBulkActionDropdown: boolean;
  encodedQuery: string | null;
  setEncodedQuery: React.Dispatch<React.SetStateAction<string | null>>;
  searchTerm?: string;
  srIsLoading?: boolean;
  searchResults?: Design[] | [];
}

// Create context with undefined as the initial value
const DesignActionContext = createContext<DesignActionContextType | undefined>(
  undefined
);

// Custom hook to use the DesignActionContext
export const useDesignActionContext = () => {
  const context = useContext(DesignActionContext);
  if (!context) {
    throw new Error(
      "useDesignActionContext must be used within a DesignActionProvider"
    );
  }
  return context;
};

// Provider component
export const DesignActionProvider: React.FC<{
  children: React.ReactNode;
  searchTerm?: string;
}> = ({ children, searchTerm = useSearchParams().get("search") ?? "" }) => {
  let querx = useSearchParams().get("search") ?? "";
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDesignName, setSelectedDesignName] = useState("");
  const [bulkSelectedRows, setBulkSelectedRows] = useState<string[]>([]);
  const [individualSelectedRows, setIndividualSelectedRows] = useState<
    string[]
  >([]);
  const [encodedQuery, setEncodedQuery] = useState<string | null>(null);
  const [dataRefetch, setDataRefetch] = useState<(() => void) | undefined>(
    undefined
  );
  const [showBulkActionDropdown, setShowBulkActionDropdown] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]); // State for storing selected row indices
  const [isDeleting, setIsDeleting] = useState(false);
  console.log("searchParams", searchTerm);
  const [showPopup, setShowPopup] = useState(false);
  const query = typeof encodedQuery === "string" ? encodedQuery : "";

  const { data: searchResults, isLoading: srIsLoading } =
    // ddclare search design logic
    useWebspirreFuzzyDesignSearch(searchTerm ? searchTerm : query);
  console.log("search Results", searchResults);

  const handleDesignDelete = async (designID: string, designName: string) => {
    setSelectedDesignName(designName);
    setIsModalOpen(true);
  };

  const handleSelectAll = (Designs: Design[]) => {
    if (bulkSelectedRows.length === Designs.length) {
      setBulkSelectedRows([]);
    } else {
      const allRowIndexes = Designs.map((_, index) => _?.uid as string);
      setBulkSelectedRows(allRowIndexes);
    }
    setShowBulkActionDropdown(false);
  };

  const handleDeleteAll = (refetch?: any) => {
    setShowPopup(true); // Show the confirmation popup
    setDataRefetch(() => refetch); // Store the refetch function without invoking it
  };

  const handleBulkActionClick = () => {
    setShowBulkActionDropdown(!showBulkActionDropdown);
  };

  const handleSelect = (rowId: string) => {
    setIndividualSelectedRows((prevSelectedRows) => {
      const updatedSelectedRows = prevSelectedRows.includes(rowId)
        ? prevSelectedRows.filter((id) => id !== rowId)
        : [...prevSelectedRows, rowId];

      setSelectedRowIds((prevSelectedRowIds) => {
        const updatedSelectedRowIds = updatedSelectedRows;
        return updatedSelectedRowIds;
      });

      return updatedSelectedRows;
    });
  };

  useEffect(() => {
    console.log("Updated selectedRowIds:", selectedRowIds);
  }, [selectedRowIds]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowBulkActionDropdown(false);
      }
    };

    if (showBulkActionDropdown) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showBulkActionDropdown]);

  // Get the length of selected rows
  const selectedRowsLength = individualSelectedRows.length;

  const value: DesignActionContextType = {
    isModalOpen,
    selectedDesignName,
    bulkSelectedRows,
    individualSelectedRows,
    handleDesignDelete,
    handleSelectAll,
    handleSelect,
    handleDeleteAll,
    handleBulkActionClick,
    selectedRowsLength,
    setIsModalOpen,
    dropdownRef,
    showBulkActionDropdown,
    encodedQuery,
    setEncodedQuery,
    searchTerm,
    srIsLoading,
    searchResults,
  };

  return (
    <DesignActionContext.Provider value={value}>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete the {selectedRowIds.length}{" "}
              selected designs?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                className={cn(
                  "px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                )}
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button
                className={cn(
                  "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600",
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                )}
                onClick={async () => {
                  setIsDeleting(true); // Set deleting state to true
                  setShowPopup(false); // Hide the confirmation popup

                  try {
                    // Attempt to delete the selected designs
                    const deleteSuccess = await deleteMultipleDesigns(
                      selectedRowIds
                    );

                    if (deleteSuccess) {
                      // If deletion is successful, call the stored refetch function if it's available
                      if (dataRefetch) {
                        dataRefetch();
                      }
                      // Reset selected row states
                      setSelectedRowIds([]);
                      setIndividualSelectedRows([]);
                    } else {
                      console.error("Failed to delete selected designs.");
                    }
                  } catch (error) {
                    console.error(
                      "An error occurred while deleting designs:",
                      error
                    );
                  } finally {
                    // Always set deleting state to false, regardless of success or failure
                    setIsDeleting(false);
                  }
                }}
              >
                {isDeleting ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 2.137.835 4.087 2.209 5.541l1.791-1.25z"
                    />
                  </svg>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {children}
    </DesignActionContext.Provider>
  );
};
