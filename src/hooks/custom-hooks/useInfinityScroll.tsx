import InfiniteLoader from "@/components/common/infiniteLoader";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollProps {
  loadMore: () => void;
  height?: string;
  triggerOnce?: boolean;
  threshold?: number;
  rootMargin?: string;
  disabled?: boolean;
  deviceFilter?: string;
  isFetching?: boolean; // Add a prop to track fetching status
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  loadMore,
  height = "10px",
  triggerOnce = true,
  threshold = 0.1,
  rootMargin = "0px",
  disabled = false,
  deviceFilter,
  isFetching = false, // Default to false
}) => {
  const [ref, inView] = useInView({
    triggerOnce,
    threshold,
    rootMargin,
  });

  useEffect(() => {
    if (inView && !disabled) {
      loadMore();
    }
  }, [inView, loadMore, disabled]);

  return (
    <>
      <div ref={ref}>
        {/* Conditionally render the InfiniteLoader */}
        {!disabled && <InfiniteLoader />}
      </div>
    </>
  );
};

export default InfiniteScroll;
