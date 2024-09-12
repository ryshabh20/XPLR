import { useEffect } from "react";

interface InfiniteScrollProps {
  scrollContainerRef: React.RefObject<HTMLElement>;
  fetchNextPage: () => Promise<any>;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  updateData: (newData: any) => void;
}

const useInfiniteScroll = ({
  scrollContainerRef,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
  updateData,
}: InfiniteScrollProps) => {
  useEffect(() => {
    const currentScrollContainerRef = scrollContainerRef.current;

    const handleScroll = async () => {
      if (!currentScrollContainerRef) return;

      const { scrollTop, scrollHeight } = currentScrollContainerRef;

      if (scrollTop < 200 && !isFetchingNextPage && hasNextPage) {
        const previousScrollHeight = scrollHeight;

        const result = await fetchNextPage();

        updateData(result);

        const newScrollHeight = currentScrollContainerRef.scrollHeight;
        currentScrollContainerRef.scrollTop =
          newScrollHeight - previousScrollHeight;
      }
    };

    if (currentScrollContainerRef) {
      currentScrollContainerRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentScrollContainerRef) {
        currentScrollContainerRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [
    scrollContainerRef,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    updateData,
  ]);
};

export default useInfiniteScroll;
