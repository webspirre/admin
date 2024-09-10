import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Tab {
  label: string;
  value: string;
}

interface TabButtonsProps {
  tabs: Tab[];
  onTabClick: (index: number) => void;
  activeTab: number;
  filterOptions: {
    value: string;
    label: string;
  }[];
  // selectedFilters: string[];
  selectedFilters: string[] | React.Dispatch<React.SetStateAction<string[]>>;
  handleFilterClick: (option: { value: string; label: string }) => void;
  showFilterOptions: boolean;
  setShowFilterOptions: (show: boolean) => void;
  categoryRoute: (category: string) => string;
  categoryId: string;
  activeTabRef: any;
}

const TabButtons: React.FC<TabButtonsProps> = ({
  tabs,
  onTabClick,
  activeTab,
  filterOptions,
  selectedFilters,
  handleFilterClick,
  showFilterOptions,
  setShowFilterOptions,
  categoryRoute,
  categoryId,
  activeTabRef,
}) => {
  const categoryCounts = tabs.map(({ label, value }) => ({
    label,
    value,
    count: 0, // Adjust according to your data
  }));

  return (
    <div className="flex mb-4 text-[12px] sm:text-[14px]">
      <div className="mr-2 relative z-d10">
        <button
          onClick={() => setShowFilterOptions(!showFilterOptions)}
          className=""
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-fit px-4 py-2 sm:py-2 bg-[#F1F0EE] rounded-full">
              <Image
                src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1705965289/utilities/Vector_dlval9.svg"
                width={15}
                height={50}
                alt="design"
              />
              <p className="font-bold text-center text-[12px]">Filter</p>
            </div>
            <div className="h-[30px] mr-4 min-w-[1px] bg-[#BDBDBD]"></div>
          </div>
        </button>

        {showFilterOptions && (
          <div className="absolute top-8 w-[150px] text-[12px]  bg-white border border-gray-300 p-2 mt-4 rounded-md shadow-md">
            {filterOptions.map((option, index) => (
              <div key={index} className="flex items-center ">
                <div className="custom-checkbox flex">
                  <input
                    type="checkbox"
                    id={option.value}
                    checked={
                      Array.isArray(selectedFilters) &&
                      selectedFilters.includes(option.value)
                    }
                    onChange={() => handleFilterClick(option)}
                    className="mr-2 hidden"
                  />
                  <label
                    htmlFor={option.value}
                    className="checkbox-label mr-2"
                  ></label>
                </div>
                <label htmlFor={option.value}>{option.label}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        className="flex items-center overflow-hidden"
        style={{ whiteSpace: "nowrap" }}
      >
        <div
          className="flex sm:gap-2 custom-scrollbar w-[420px]"
          style={{ overflowX: "auto", scrollbarWidth: "none" }}
        >
          {tabs.map((tab, index) => (
            <Link
              href={categoryRoute(tab.value)}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = categoryRoute(tab.value);
              }}
              ref={categoryId === tab.value ? activeTabRef : null}
              key={index}
              className={`px-4 py-1 sm:py-1 border-b-2 mr-2 w-fit text-[12px] ${
                categoryId === tab.value
                  ? "border-2 rounded-full bg-black text-white font-medium"
                  : "border-2 rounded-full text-black  hover:text-gray-700 hover:border-gray-500"
              }`}
            >
              {(categoryCounts.find((c) => c.value === tab.value)?.count ?? 0) >
              0 ? (
                <div className="flex gap-2 items-center">
                  <div>{tab.label}</div>
                  <div
                    className={`bg-[#F3F4F6] rounded-full p-1 text-[12px] ${
                      activeTab === index
                        ? "rounded-full bg-[#F3F4F6] text-black"
                        : "rounded-full text-black hover:text-gray-700 hover:border-gray-500"
                    }`}
                  >
                    {categoryCounts.find((c) => c.label === tab.label)?.count ??
                      0}
                  </div>
                </div>
              ) : (
                tab.label
              )}
            </Link>
          ))}
        </div>
      </div>
      <div className="h-[30px] mr-4 min-w-[1px] bg-[#BDBDBD]"></div>
    </div>
  );
};

export default TabButtons;
