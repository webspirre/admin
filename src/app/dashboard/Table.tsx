"use client";

import React, { useState, useRef, useEffect } from "react";
import { DesignDatabase } from "@/types/types_db";
import useDataFetch from "@/hooks/useDataFetch";
import InfiniteScroll from "@/hooks/custom-hooks/useInfinityScroll";
import { useRouter } from "next/navigation";
import {
  deleteDesign,
  fetchTotalDesigns,
  getCachedTotalDesigns,
} from "../../../lib/supabase/queries/designs";
import toast from "react-hot-toast";
import Link from "next/link";
import { useDesignActionContext } from "@/context/DesignActionProvider";
import TotalDesigns from "../actions/totalDesigns";
import { cn } from "../../../lib/cn";
import EmptyState from "@/components/ui/EmptyState";
import DeleteSingleModal from "@/components/modal/DeleteSingleModal";
import { useQueryClient } from "react-query";

type Design = DesignDatabase["webspirre_admin"]["Tables"]["website"]["Row"];

interface TableProps {
  columns: string[];
  data: Design[];
  bulkSelectedRows: string[];
  individualSelectedRows: string[];
  setIndividualSelectedRows?: (rows: string[]) => void;
}

const Table: React.FC<TableProps> = ({
  columns,
  data = [],
  bulkSelectedRows,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [selectedDesignName, setSelectedDesignName] = useState("");
  const [selectedDesignId, setSelectedDesignId] = useState("");
  const {
    handleSelect,
    individualSelectedRows,
    srIsLoading,
    searchTerm,
    searchResults,
  } = useDesignActionContext();

  const router = useRouter();
  const [openPopupIndex, setOpenPopupIndex] = useState<number | null>(null);

  const {
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading: mainIsLoading,
    totalDesigns,
    TDisLoading,
    currentPage,
    Designs,
    refetch,
  } = useDataFetch();

  const isLoading = searchTerm && searchTerm ? TDisLoading : mainIsLoading;

  const popupRef = useRef<HTMLDivElement | null>(null);

  const handleDesignDelete = async (designID: string, designName: string) => {
    setSelectedDesignName(designName);
    setSelectedDesignId(designID);
    setIsModalOpen(true);
  };

  const confirmDelete = async (designID: string) => {
    const deleted = await deleteDesign(designID);
    setIsModalOpen(false);

    if (deleted) {
      console.log(`Design with ID ${designID} deleted successfully`);

      // Show success toast
      toast.success(
        `Design with Name ${selectedDesignName} deleted successfully`
      );

      // Invalidate the designs query to refetch and refresh the paginated data
      refetch();
      queryClient.invalidateQueries([
        "synchronizedesignsDynamic",
        { page: currentPage },
      ]);
      queryClient.invalidateQueries("searchedDesigns");
    } else {
      console.log(`Failed to delete design with ID ${designID}`);

      // Show error toast
      toast.error(`Failed to delete design with Name ${selectedDesignName}`);
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setOpenPopupIndex(null);
    }
  };

  useEffect(() => {
    if (openPopupIndex !== null) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openPopupIndex]);

  function capitalizeWords(category: string) {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
  }

  if (!data) return [];
  return (
    <div className="text-[#989898]">
      <DeleteSingleModal
        isOpen={isModalOpen}
        designName={selectedDesignName}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => confirmDelete(selectedDesignId)}
      />
      <p
        className={cn(
          "text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-200",
          !searchTerm && "hidden"
        )}
      >
        Showing <span className="text-blue-500">{data.length}</span> result
        {data.length !== 1 ? "s" : ""} for{" "}
        <span className="italic text-gray-600 dark:text-gray-400">
          '{searchTerm}'
        </span>
      </p>
      {TDisLoading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="bg-gray-300 rounded-lg w-full h-10"></div>
        </div>
      ) : (
        <p className="t mb-4 text-black bg-gray-100 rounded-lg px-4 py-2 shadow-sm">
          Total number of uploaded designs:{" "}
          <span className="font-bold text-[16px] underline">
            {totalDesigns}
          </span>
        </p>
      )}
      {/* table header */}
      <div className="flex- grid grid-cols-6 justify-between- items-center text-gray-500 text-[14px] mb-3">
        {columns.map((column, index) => (
          <p key={index} className="text-center">
            {column}
          </p>
        ))}
      </div>
      {(!searchTerm || searchTerm === "") && !isLoading && data.length === 0 ? (
        <EmptyState
          image="https://res.cloudinary.com/dwqantex4/image/upload/w_500,f_auto/v1716472523/hero_H1_and_vector_r6n8qn.png"
          title="No designs at the moment"
          subtitle="Please check back later or adjust your filters."
        />
      ) : searchTerm && !isLoading && data.length === 0 ? (
        // <EmptyState
        //   image="https://res.cloudinary.com/dwqantex4/image/upload/v1725945061/a_very_simple_animated_search_loader_gif-removebg-preview_1_jy3fla.png"
        //   title={`Loading designs for '${searchTerm}' found ${
        //     data.length === 0 ? "Nothing" : "some designs"
        //   }`}
        //   subtitle=""
        // />
        <EmptyState
          image="https://res.cloudinary.com/dwqantex4/image/upload/w_500,f_auto/v1716472523/hero_H1_and_vector_r6n8qn.png"
          title="No designs at the moment"
          subtitle="Please check back later or adjust your filters."
        />
      ) : null}
      {/* table rows */}
      {data.map((row, rowIndex) => (
        <div key={row?.uid as string} className="flex gap-2 items-center">
          {/* This should be visible when "Select" is clicked */}
          <div
            // onClick={() => handleSelect(rowIndex)}
            onClick={() => handleSelect(row?.uid as string)}
            className={`h-[18px] w-[18px] border flex justify-center items-center rounded-[4px] cursor-pointer p-[2px] border-[#FAB843] ${
              bulkSelectedRows.includes(row?.uid as string) ||
              individualSelectedRows.includes(row?.uid as string)
                ? "visible"
                : "hidden"
            }`}
          >
            {/* Main Selection Indecator */}
            <div
              className={`bg-[#FAB843] flex h-full w-full rounded-[4px] ${
                individualSelectedRows.includes(row?.uid as string)
                  ? "visible"
                  : "hidden"
              }`}
            ></div>{" "}
          </div>
          {/* grid grid-cols-7 */}
          <div className="flex- grid grid-cols-6 text-center- text-[14px] border shadow-md justify-between- items-center p-2 w-full rounded-[24px] mb-2">
            <div className="flex gap-8 items-center">
              <Link
                href={`https://www.webspirre.com/detail/${row?.uid}`}
                className="relative flex min-w-10 h-10"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={row?.logoImageURL as string}
                  alt=""
                  className="w-full h-full rounded-2xl"
                />
                <img
                  src={row.logoImageURL as string}
                  alt=""
                  className="absolute rounded top-2.5 -right-2 w-5 h-5"
                />
              </Link>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.webspirre.com/detail/${row?.uid}`}
                className="flex overflow-x-hidden w-[150px]"
              >
                {" "}
                <p className="font-bold text-black ">{row?.name as string}</p>
              </Link>
            </div>

            <div className="flex- overflow-x-hidden text-center w-[150px]-">
              <p className="text-center">
                {Array.isArray(row.categories) && (row.categories[0] as string)}
              </p>
            </div>
            <div>
              <p className="text-center">{row.pageType as string}</p>
            </div>
            <div>
              <p className="text-center">{row?.date as string}</p>
            </div>
            <p className="text-center">
              Active
              {/* {row["Status"]} */}
            </p>
            <div className="flex col-span-1/2 justify-end gap-8 items-center relative pr-[20px]">
              <button onClick={() => setOpenPopupIndex(rowIndex)}>
                <img
                  src={
                    "https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718621241/utilities/webspirre/Frame_34_1_prp0wr.svg"
                  }
                  alt=""
                />
              </button>
              {openPopupIndex === rowIndex && (
                <div
                  ref={popupRef}
                  className="absolute top-full right-0 z-20 mt-2 w-32 bg-white border shadow-md rounded-md p-2"
                >
                  <button
                    className="w-full flex items-center gap-2 text-left p-1 hover:bg-gray-100"
                    onClick={() => handleSelect(row?.uid as string)}
                  >
                    <img
                      src={
                        individualSelectedRows.includes(row?.uid as string)
                          ? "https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718618172/utilities/webspirre/fi_check-square_r2xdvk.svg"
                          : "https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718618172/utilities/webspirre/fi_check-square_r2xdvk.svg"
                      }
                      alt=""
                    />
                    {individualSelectedRows.includes(row?.uid as string)
                      ? "Unselect"
                      : "Select"}
                  </button>
                  <button
                    className="w-full flex items-center gap-2 text-left p-1 hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default link behavior
                      window.location.href = `/dashboard/content/edit/${row?.uid}`; // Force a full page reload
                      router.push(`/dashboard/content/edit/${row?.uid}`);
                    }}
                  >
                    <img
                      src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718762840/utilities/webspirre/Edit_duotone_line_vcq4ls.svg"
                      alt=""
                    />
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDesignDelete(
                        row?.uid as string,
                        row?.name as string
                      )
                    }
                    className="flex items-center gap-2 w-full text-left text-[#FA4C4C] p-1 hover:bg-gray-100"
                  >
                    <img
                      src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718762840/utilities/webspirre/fi_trash-2_pvcgbs.svg"
                      alt=""
                    />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {/* INFINITY HANDLER */}
      {!searchTerm && data.length > 0 && hasNextPage && (
        <InfiniteScroll
          loadMore={fetchNextPage}
          height="20px"
          triggerOnce={false}
          threshold={0.1}
          rootMargin="10px"
          disabled={!hasNextPage || isFetchingNextPage}
        />
      )}
    </div>
  );
};

export default Table;
