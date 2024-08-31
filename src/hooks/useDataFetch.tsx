import { useContext, useDebugValue } from "react";
import DataFetchContext, {
  DataFetchContextType,
} from "@/context/DataFetchProvider";

export const useDataFetch = (): DataFetchContextType => {
  const context = useContext(DataFetchContext);
  if (!context) {
    throw new Error("useDataFetch must be used within a DataFetchProvider");
  }
  const { Designs, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    context;
  useDebugValue({
    Designs: Designs.length > 0 ? "Loaded" : "Not Loaded",
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  });
  return context;
};

export default useDataFetch;
