import { useCallback, useMemo, useState } from "react";

export const usePagination = (items, perPage = 9) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  const goToPage = useCallback(
    (next) => {
      setPage(Math.min(Math.max(1, next), totalPages));
    },
    [totalPages]
  );

  const resetPage = useCallback(() => setPage(1), []);

  return { page, totalPages, paginatedItems, goToPage, resetPage, setPage };
};

export default usePagination;
