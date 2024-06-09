import * as React from "react";
import { useState, useEffect } from "react";

const Loader: React.FC<{
  handleLoading: () => void;
  loading?: boolean;
  loaderText: string;
}> = ({ handleLoading, loaderText }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 95 ? prev + 1 : prev));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [progress]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg text-slate-900 flex flex-col">
        <p className="text-center text-xl font-semibold animate-pulse">
          {!loaderText ? "Loading ... " : loaderText}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="hidden" onClick={handleLoading}>
          cancel
        </p>
      </div>
    </div>
  );
};

export default Loader;
