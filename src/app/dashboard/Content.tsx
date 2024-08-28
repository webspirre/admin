import React, { useState, useRef, useEffect } from "react";
import Table from "./Table";
import TabButtons from "./TabButtons";

const Content: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const searchResultRef = useRef<HTMLDivElement>(null);

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
  ];

  const filterOptions = [
    "landing",
    "pricing",
    "about",
    "login",
    "signup",
    "404",
  ];

  const handleFilterClick = (option: string) => {
    if (selectedFilters.includes(option)) {
      setSelectedFilters(selectedFilters.filter((filter) => filter !== option));
    } else {
      setSelectedFilters([...selectedFilters, option]);
    }
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
  const data = [
    {
      "Main Image":
        "https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718621035/utilities/webspirre/Frame_676_dtojuh.svg",
      "Profile Image":
        "https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718759392/utilities/webspirre/profile_image_w1dtld.svg",
      "Name of Website": "Gaming Page",
      Devices: "Web | Mobile",
      Category: "E-commerce",
      "Page Type": "Home",
      "Last Modified": "12 Jun 2024 12:55 am",
      Status: "Live",
      "Action Image":
        "https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718621241/utilities/webspirre/Frame_34_1_prp0wr.svg",
    },
    {
      "Main Image":
        "https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718621035/utilities/webspirre/Frame_676_dtojuh.svg",
      "Profile Image":
        "https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718759392/utilities/webspirre/profile_image_w1dtld.svg",
      "Name of Website": "Gaming Page",
      Devices: "Web | Mobile",
      Category: "Blog",
      "Page Type": "Article",
      "Last Modified": "12 Jun 2024 12:55 am",
      Status: "Live",
      "Action Image":
        "https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718621241/utilities/webspirre/Frame_34_1_prp0wr.svg",
    },
    // Add more data as needed
  ];

  return (
    <div className="p-8">
      <div className=" p-[30px] rounded-[20px] w-full   bg-white">
        <div className="flex text-[#888888] text-[12px]  gap-4">
          <div className="px-2 h-fit w-[160px] py-2 flex justify-between items-center border-2 border-[#C7C7C7] gap-4 rounded-full">
            <div className=" flex gap-2 items-center">
              {" "}
              <div className="border-2  border-[#C7C7C7] rounded-full w-4 h-4"></div>
              <p className=" line-clamp-1">Bulk action</p>
            </div>

            <img
              src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718618172/utilities/webspirre/Expand_down_zyhxny.svg"
              alt=""
            />
          </div>
          <div className="px-2 pr-8 py-2 h-fit flex items-center border-2 border-[#C7C7C7] gap-2 rounded-full">
            <img
              src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718618334/utilities/webspirre/magnifier_cqcusg.svg"
              alt=""
            />
            <input type="text" placeholder="Search uploads"  className=" focus:outline-none "/>
          </div>
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
          />
        </div>

        <div className=" py-6">
          <Table columns={columns} data={data} />
        </div>
      </div>
      {/* website image, Name of Website, Devices, Category, Page Type, Last
      modified, Status, */}
    </div>
  );
};

export default Content;
