import React, { useState, useRef, useEffect } from "react";
import { DesignDatabase } from "@/types/types_db";
import useDataFetch from "@/hooks/useDataFetch";
import InfiniteScroll from "@/hooks/custom-hooks/useInfinityScroll";
import { useRouter } from "next/navigation";
import { deleteDesign } from "../../../lib/supabase/queries/designs";
import toast from "react-hot-toast";
import Link from "next/link";
import { useDesignActionContext } from "@/context/DesignActionProvider";

interface DeleteModalProps {
  isOpen: boolean;
  designName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  designName,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
        <p>
          Are you sure you want to delete the design with Name{" "}
          <strong>{designName}</strong>?
        </p>
        <div className="mt-6 flex justify-end">
          <button
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-md"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [selectedDesignName, setSelectedDesignName] = useState("");
  const { handleSelect, individualSelectedRows } = useDesignActionContext();

  const handleDesignDelete = async (designID: string, designName: string) => {
    setSelectedDesignName(designName);
    setIsModalOpen(true);
  };

  const confirmDelete = async (designID: string) => {
    const deleted = await deleteDesign(designID);
    setIsModalOpen(false);

    if (deleted) {
      console.log(`Design with ID ${designID} deleted successfully`);
      toast.success(
        `Design with Name ${selectedDesignName} deleted successfully`
      );
    } else {
      console.log(`Failed to delete design with ID ${designID}`);
      toast.error(`Failed to delete design with Name ${selectedDesignName}`);
    }
  };

  const router = useRouter();
  const [openPopupIndex, setOpenPopupIndex] = useState<number | null>(null);
  // const [individualSelectedRows, setIndividualSelectedRows] = useState<
  //   number[]
  // >([]);

  const { hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useDataFetch();

  const popupRef = useRef<HTMLDivElement | null>(null);

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

  // const handleSelect = (rowIndex: number) => {
  //   if (individualSelectedRows.includes(rowIndex)) {
  //     setIndividualSelectedRows(
  //       individualSelectedRows.filter((index) => index !== rowIndex)
  //     );
  //   } else {
  //     setIndividualSelectedRows([...individualSelectedRows, rowIndex]);
  //   }
  //   setOpenPopupIndex(null); // close the popup after selecting
  // };

  if (!data) return [];
  return (
    <div className="text-[#989898]">
      <DeleteModal
        isOpen={isModalOpen}
        designName={selectedDesignName}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => confirmDelete("designID123")}
      />
      {/* table header */}
      <div className="flex justify-between items-center text-gray-500 text-xs mb-3">
        {columns.map((column, index) => (
          <p key={index} className="text-center font-semibold text-gray-800">
            {column}
          </p>
        ))}
      </div>

      {!isLoading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className={`text-center`}>
            <img
              src="https://res.cloudinary.com/dwqantex4/image/upload/w_500,f_auto/v1716472523/hero_H1_and_vector_r6n8qn.png" // Replace with the path to your image
              alt="No designs found"
              className="mb-6"
            />
            <p className="text-lg text-slate-800 font-semibold mb-2">
              No designs at the moment
            </p>
            <p className="text-sm text-slate-500">
              Please check back later or adjust your filters.
            </p>
          </div>
        </div>
      )}

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

          <div className="flex border shadow-md justify-between items-center p-2 w-full rounded-[24px] mb-2">
            <div className="flex gap-8 items-center">
              <div
                // href={`https://www.webspirre.com/detail/${row?.uid}`}
                className="relative flex w-10 h-10"
                // target="_blank"
                // rel="noopener noreferrer"
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
              </div>
              <p className="font-bold text-black">{row?.name as string}</p>
            </div>
            <div>
              <p>Desktop | Mobile</p>
            </div>
            <div className="w-32 overflow-x-auto whitespace-nowrap hide-scrollbar">
              {Array.isArray(row.categories) &&
                (row.categories as string[]).map(
                  (category: string, index: number) => (
                    <Link
                      href={`/dashboard/content/category/${
                        // category.toLowerCase() as string
                        category as string
                      }`}
                      key={index}
                      className="inline-block mr-1"
                    >
                      {capitalizeWords(category)}
                      {index < (row.categories as string[]).length - 1
                        ? " ,"
                        : ""}
                    </Link>
                  )
                )}
            </div>

            {/* <div>
              <p>
                {Array.isArray(row.categories) && (row.categories[0] as string)}
              </p>
            </div> */}
            <div>
              <p>{row.pageType as string}</p>
            </div>
            <div>
              <p>{row?.date as string}</p>
            </div>
            <div className="flex gap-8 items-center relative pr-[20px]">
              <p>
                Active
                {/* {row["Status"]} */}
              </p>
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
      {data.length > 0 && hasNextPage && (
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
