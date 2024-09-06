"use client";

import { Design } from "@/types/types";
import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";
import { deleteMultipleDesigns } from "../../lib/supabase/queries/designs";

// Define the type for the context
interface DesignActionContextType {
  isModalOpen: boolean;
  selectedDesignName: string;
  bulkSelectedRows: string[];
  individualSelectedRows: string[];
  handleDesignDelete: (designID: string, designName: string) => void;
  handleSelectAll: (Designs: Design[]) => void;
  handleSelect: (rowIndex: string) => void;
  handleDeleteAll: () => void;
  handleBulkActionClick: () => void;
  selectedRowsLength: number;
  setIsModalOpen: (open: boolean) => void;
  dropdownRef?: React.RefObject<HTMLDivElement>;
  showBulkActionDropdown: boolean;
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
export const DesignActionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDesignName, setSelectedDesignName] = useState("");
  const [bulkSelectedRows, setBulkSelectedRows] = useState<string[]>([]);
  const [individualSelectedRows, setIndividualSelectedRows] = useState<
    string[]
  >([]);
  const [showBulkActionDropdown, setShowBulkActionDropdown] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]); // State for storing selected row indices
  const Designs: Design[] = []; // Placeholder for Designs

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

  const handleDeleteAll = async () => {
    // Prompt the user for confirmation, including the number of selected designs
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedRowIds.length} selected designs?`
    );

    if (!confirmDelete) {
      // If the user cancels, simply return without doing anything
      return;
    }

    console.log("Delete All clicked");
    setShowBulkActionDropdown(false);

    const deleteSuccess = await deleteMultipleDesigns(selectedRowIds); // Call delete function with selected row IDs
    if (deleteSuccess) {
      console.log("Successfully deleted selected designs.");
      // Optionally clear the selected rows after deletion
      setSelectedRowIds([]);
      setIndividualSelectedRows([]);
    } else {
      console.error("Failed to delete selected designs.");
    }
  };

  const handleBulkActionClick = () => {
    setShowBulkActionDropdown(!showBulkActionDropdown);
  };

  // Function to handle individual row selection
  //   const handleSelects = (rowIndex: number) => {
  //     if (individualSelectedRows.includes(rowIndex)) {
  //       setIndividualSelectedRows(
  //         individualSelectedRows.filter((index) => index !== rowIndex)
  //       );
  //     } else {
  //       setIndividualSelectedRows([...individualSelectedRows, rowIndex]);
  //     }
  //   };

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
  };

  return (
    <DesignActionContext.Provider value={value}>
      {children}
    </DesignActionContext.Provider>
  );
};
