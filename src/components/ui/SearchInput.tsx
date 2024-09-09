import { forwardRef, ChangeEvent } from "react";

interface SearchInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholder: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onFocus, onBlur, placeholder }, ref) => {
    return (
      <div className="px-2 pr-8 py-2 h-fit flex items-center border-2 border-[#C7C7C7] gap-2 rounded-full">
        <img
          src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1718618334/utilities/webspirre/magnifier_cqcusg.svg"
          alt=""
        />
        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className="focus:outline-none"
          ref={ref}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
export default SearchInput;
