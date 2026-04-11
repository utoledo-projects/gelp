import {RefObject, useEffect} from "react";

const useInfiniteScroll = (wrapperRef: RefObject<HTMLDivElement | null>, bottomRef: RefObject<HTMLDivElement | null>, loadingRef: RefObject<boolean>, fetch: () => Promise<void>, condition?: boolean) => {
  useEffect(() => {
    if (condition === false)
      return;
    if (wrapperRef.current === null || bottomRef.current === null)
      throw new Error('useInfiniteScroll refs must be populated.');

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || loadingRef.current)
        return;

      fetch().catch(console.error);
    }, {
      root: wrapperRef.current,
      rootMargin: '100px'
    });

    observer.observe(bottomRef.current);

    return () => {
      observer.disconnect();
    }
  }, [condition]);
}

export default useInfiniteScroll;
