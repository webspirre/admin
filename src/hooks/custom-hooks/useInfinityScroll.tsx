// InfiniteScroll.tsx
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
}

/**
 * InfiniteScroll component
 *
 * @param {Function} loadMore - Function to call when the element is in view
 * @returns {JSX.Element} - A div element that triggers the loadMore function when in view
 */

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  loadMore,
  height = "10px",
  triggerOnce = true,
  threshold = 0.1,
  rootMargin = "0px",
  disabled = false,
  deviceFilter,
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
      {/* <div ref={ref} style={{ height }} className="opacity-0 hidden" /> */}
      <div ref={ref}>
        <InfiniteLoader />
      </div>
    </>
  );
};

export default InfiniteScroll;
