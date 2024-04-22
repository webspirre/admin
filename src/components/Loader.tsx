import * as React from "react";

const Loader: React.FC<{
  handleLoading: () => void;
  loading?: boolean;
  loaderText: string;
}> = ({ handleLoading, loaderText }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg text-slate-900 flex flex-col">
        <p className="text-center text-xl font-semibold animate-pulse">
          {!loaderText ? "Loading ... " : loaderText}
        </p>
        <p className="hidden" onClick={handleLoading}>
          cancel
        </p>
      </div>
    </div>
  );
};

export default Loader;
