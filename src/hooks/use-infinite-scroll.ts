import { useState, useEffect, useCallback, useRef } from "react";

interface UseInfiniteScrollOptions<T> {
  items: T[];
  itemsPerPage?: number;
}

type WithLoopKey<T> = T & { _loopKey: string };

export function useInfiniteScroll<T extends { id: string }>({ items, itemsPerPage = 5 }: UseInfiniteScrollOptions<T>) {
  const [displayedItems, setDisplayedItems] = useState<WithLoopKey<T>[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loopCount = useRef(0);

  // Initialize with first batch
  useEffect(() => {
    if (items.length > 0) {
      const initialItems = items.slice(0, itemsPerPage).map((item, i) => ({
        ...item,
        _loopKey: `init-${item.id}-${i}`,
      }));
      setDisplayedItems(initialItems);
      loopCount.current = 0;
    }
  }, [items, itemsPerPage]);

  const loadMore = useCallback(() => {
    if (isLoading || items.length === 0) return;

    setIsLoading(true);
    
    setTimeout(() => {
      const totalItems = items.length;
      const currentCount = displayedItems.length;
      const nextStartIndex = currentCount % totalItems;
      const nextItems: WithLoopKey<T>[] = [];
      
      for (let i = 0; i < itemsPerPage; i++) {
        const index = (nextStartIndex + i) % totalItems;
        const item = { 
          ...items[index], 
          _loopKey: `loop-${loopCount.current}-${index}-${currentCount + i}` 
        };
        nextItems.push(item);
      }
      
      if (nextStartIndex + itemsPerPage >= totalItems) {
        loopCount.current += 1;
      }
      
      setDisplayedItems(prev => [...prev, ...nextItems]);
      setPage(prev => prev + 1);
      setIsLoading(false);
    }, 300);
  }, [items, itemsPerPage, displayedItems.length, isLoading]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, isLoading]);

  return { displayedItems, isLoading, loaderRef };
}
