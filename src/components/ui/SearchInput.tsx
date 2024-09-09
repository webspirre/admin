"use client";

import { forwardRef, ChangeEvent } from "react";
import { cn } from "../../../lib/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const inputImg =
      "https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718618334/utilities/webspirre/magnifier_cqcusg.svg";
    return (
      <div className="px-2 pr-8 py-2 h-fit flex items-center border-2 border-[#C7C7C7] gap-2 rounded-full">
        <img src={inputImg} alt="search-input-img" />
        <input
          type={type}
          className={cn("focus:outline-none", className)}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
export default SearchInput;
