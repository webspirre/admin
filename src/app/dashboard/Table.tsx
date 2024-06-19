import React, { useState, useRef, useEffect } from "react";

interface TableProps {
  columns: string[];
  data: { [key: string]: any }[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
  const [openPopupIndex, setOpenPopupIndex] = useState<number | null>(null);
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

  return (
    <div className=" text-[#989898]">
      {/* table header */}
      <div className="flex text-[#989898] text-[12px] text-center justify-between mb-2">
        {columns.map((column, index) => (
          <p key={index} className="text-center">
            {column}
          </p>
        ))}
      </div>

      {/* table rows */}
      {data.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex border shadow-md justify-between items-center p-2 w-full rounded-[24px] mb-2"
        >
          <div className="flex gap-8 items-center">
            <div className="relative flex w-fit">
              <img src={row["Main Image"]} alt="" className="" />
              <img
                src={row["Profile Image"]}
                alt=""
                className="flex absolute top-[10px] -right-4"
              />
            </div>
            <p className="font-bold text-black ">{row["Name of Website"]}</p>
          </div>
          <div>
            <p>{row["Devices"]}</p>
          </div>
          <div>
            <p>{row["Category"]}</p>
          </div>
          <div>
            <p>{row["Page Type"]}</p>
          </div>
          <div>
            <p>{row["Last Modified"]}</p>
          </div>
          <div className="flex gap-8 items-center relative pr-[20px]">
            <p>{row["Status"]}</p>
            <button onClick={() => setOpenPopupIndex(rowIndex)}>
              <img src={row["Action Image"]} alt="" />
            </button>
            {openPopupIndex === rowIndex && (
              <div
                ref={popupRef}
                className="absolute top-full right-0 z-20 mt-2 w-32 bg-white border shadow-md rounded-md p-2"
              >
                <button className=" w-full flex items-center gap-2 text-left p-1 hover:bg-gray-100">
                  <img
                    src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718618172/utilities/webspirre/fi_check-square_r2xdvk.svg"
                    alt=""
                  />
                  Select
                </button>
                <button className=" w-full flex items-center gap-2 text-left p-1 hover:bg-gray-100">
                  <img
                    src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718762840/utilities/webspirre/Edit_duotone_line_vcq4ls.svg"
                    alt=""
                  />
                  Edit
                </button>
                <button className="flex items-center gap-2 w-full text-left text-[#FA4C4C] p-1 hover:bg-gray-100">
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
      ))}
    </div>
  );
};

export default Table;
