"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Table from "./Table";
import TabButtons from "./TabButtons";
import useAuth from "@/hooks/useAuth";
import {
  generateFilteredURLAndRoute,
  isValidCategory,
  pageTypes,
  tabs,
  useFilteredPagetypeValues,
} from "@/util/data.util";
import useSessionStorage from "@/hooks/custom-hooks/useSessionStorage";
import useDataFetch from "@/hooks/useDataFetch";
import { useRouter } from "next/navigation";
import useUpdateSelectedFilters from "@/hooks/custom-hooks/useSelectedFilters";
import { Option } from "@/types/types_db";
import useSearchInput from "@/hooks/custom-hooks/useSearchInput";
import SearchInput from "@/components/ui/SearchInput";
import { useDesignActionContext } from "@/context/DesignActionProvider";
const filterOptions = pageTypes;

const Content: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useSessionStorage<string[]>(
    "selectedFilters",
    []
  );
  // const [showBulkActionDropdown, setShowBulkActionDropdown] = useState(false);
  const [hasFilterToggled, setHasFilterToggled] = useState(false);

  // const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const searchResultRef = useRef<HTMLDivElement>(null);
  // const dropdownRef = useRef<HTMLDivElement>(null);
  // const [bulkSelectedRows, setBulkSelectedRows] = useState<number[]>([]);
  const { Designs, categoryId, pageTypes = [], refetch } = useDataFetch();
  const {
    handleBulkActionClick,
    handleDeleteAll,
    handleSelectAll,
    selectedRowsLength,
    individualSelectedRows,
    dropdownRef,
    showBulkActionDropdown,
    bulkSelectedRows,
  } = useDesignActionContext();

  console.log("pageTypes", pageTypes);

  const {
    searchQuery,
    searchInputRef,
    handleSearchChange,
    handleInputFocus,
    handleInputClear,
  } = useSearchInput(router, refetch);

  const { userId } = useAuth();
  const filteredURL = useFilteredPagetypeValues(selectedFilters as string[]);
  const activeTabRef = useRef(null);

  if (typeof setSelectedFilters === "function") {
    useUpdateSelectedFilters(
      pageTypes,
      selectedFilters as string[],
      (filters) => setSelectedFilters(filters)
    );
  }

  const newFilteredURL = useFilteredPagetypeValues(
    pageTypes && pageTypes.length > 0 ? pageTypes : []
  );

  const filteredData = useMemo(() => {
    let filteredResults = Designs;

    if (activeTab !== 0) {
      const activeCategory = tabs[activeTab].value;
      filteredResults = filteredResults.filter(
        (result) =>
          Array.isArray(result.categories) &&
          result.categories?.includes(activeCategory as Option & string)
      );
    }
    if (hasFilterToggled) {
      if (selectedFilters.length > 0) {
        filteredResults = filteredResults.filter(
          (result) =>
            Array.isArray(selectedFilters) &&
            result?.pageType !== null &&
            selectedFilters.includes(result.pageType.toString())
        );
      }
    }

    return filteredResults;
  }, [Designs, activeTab, selectedFilters, hasFilterToggled]);

  console.log(filteredData, Designs);

  const handleFilterClick = (option: { value: string; label: string }) => {
    const newFilters =
      Array.isArray(selectedFilters) && selectedFilters.includes(option.value)
        ? selectedFilters.filter((filter) => filter !== option.value)
        : [...(selectedFilters as string[]), option.value];

    generateFilteredURLAndRoute(option, newFilters, router, categoryId!);

    (setSelectedFilters as (filters: string[]) => void)(newFilters);
  };

  // const handleBulkActionClick = () => {
  //   setShowBulkActionDropdown(!showBulkActionDropdown);
  // };

  // const handleSelectAll = () => {
  //   if (bulkSelectedRows.length === Designs.length) {
  //     setBulkSelectedRows([]);
  //   } else {
  //     const allRowIndexes = Designs.map((_, index) => index);
  //     setBulkSelectedRows(allRowIndexes);
  //   }
  //   setShowBulkActionDropdown(false);
  // };

  // const handleDeleteAll = () => {
  //   console.log("Delete All clicked");
  //   setShowBulkActionDropdown(false);
  // };

  const categoryRoute = (category: string) => {
    const isValid =
      categoryId &&
      isValidCategory(categoryId) &&
      pageTypes &&
      pageTypes.length > 0;
    const route = isValid
      ? `/dashboard/content/category/${category}/pagetypes/pagetype?${newFilteredURL}`
      : `/dashboard/content/category/${category}`;
    return route;
  };

  const columns = [
    "",
    "Name of Website",
    "Devices",
    "Category",
    "Page Type",
    "Last Modified",
    "Status",
    "",
  ];

  return (
    <div className="p-4">
      <div className="p-[30px] rounded-[20px] w-full bg-white">
        <div className="flex relative text-[#888888] text-[12px] gap-4">
          <div
            className="px-2 h-fit w-[160px] py-2 flex justify-between items-center border-2 border-[#C7C7C7] gap-4 rounded-full cursor-pointer"
            onClick={handleBulkActionClick}
          >
            <div className="flex gap-2 items-center">
              <div className="border-2 border-[#C7C7C7] rounded-full flex justify-center items-center w-5 h-5 px-1">
                {/* <span className="text-xs">{setSelectedRows.length}</span> */}
                <span className="text-xs text-[#FAB843] font-bold">
                  {selectedRowsLength}
                </span>
              </div>
              <p className="line-clamp-1">Bulk action</p>
            </div>

            <img
              src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718618172/utilities/webspirre/Expand_down_zyhxny.svg"
              alt=""
            />
          </div>
          {showBulkActionDropdown && (
            <div
              ref={dropdownRef}
              className="absolute top-[42px] left-[px] py-2 z-10 bg-white border border-[#C7C7C7] shadow-lg rounded-md w-[160px]"
            >
              <button
                className="bloc-k w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-1 items-center"
                onClick={() => handleSelectAll(Designs)}
              >
                <img
                  src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718618172/utilities/webspirre/fi_check-square_r2xdvk.svg"
                  alt=""
                />

                {bulkSelectedRows.length === Designs.length
                  ? "Unselect All"
                  : "Select More"}
              </button>
              <button
                className="block- w-full text-left px-4 py-2 text-[#FA4C4C] hover:bg-gray-100  flex gap-1 items-center disabled:bg-opacity-30 disabled:text-opacity-50 disabled:cursor-not-allowed"
                onClick={handleDeleteAll}
                disabled={selectedRowsLength === 0}
              >
                <img
                  src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718762840/utilities/webspirre/fi_trash-2_pvcgbs.svg"
                  alt=""
                />
                Delete All
              </button>
            </div>
          )}
          {/* SEARCHINPUT */}

          <SearchInput
            onBlur={handleInputClear}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            value={searchQuery as string}
            ref={searchInputRef}
            placeholder={"Search..."}
          />
          {/* Filter bar option section */}
          <TabButtons
            tabs={tabs}
            onTabClick={setActiveTab}
            activeTab={activeTab}
            filterOptions={filterOptions}
            selectedFilters={selectedFilters}
            handleFilterClick={handleFilterClick}
            showFilterOptions={showFilterOptions}
            setShowFilterOptions={setShowFilterOptions}
            categoryRoute={categoryRoute}
            categoryId={categoryId as string}
            activeTabRef={activeTabRef}
          />
        </div>

        <div className="py-6">
          <Table
            columns={columns}
            data={filteredData}
            bulkSelectedRows={bulkSelectedRows}
            // individualSelectedRows={selectedRows}
            individualSelectedRows={individualSelectedRows}
            // setIndividualSelectedRows={setSelectedRows}
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default Content;
