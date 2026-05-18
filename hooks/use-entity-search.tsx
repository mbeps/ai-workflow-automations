import { useEffect, useState } from "react";
import { PAGINATION } from "@/config/constants";

/**
 * Hook for managing debounced search state for paginated entity lists.
 * It synchronizes a local search input with URL/state parameters and
 * resets the page to the default when the search query changes.
 *
 * @param params - The current search and pagination parameters.
 * @param setParams - Callback to update the search and pagination parameters.
 * @param debounceMs - Delay in milliseconds before triggering the search update.
 * @returns An object containing the current local search value and a change handler.
 * @author Maruf Bepary
 */
interface UseEntitySearchProps<
  T extends {
    search: string;
    page: number;
  },
> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}

export function useEntitySearch<
  T extends {
    search: string;
    page: number;
  },
>({ params, setParams, debounceMs = 500 }: UseEntitySearchProps<T>) {
  const [localSearch, setLocalSearch] = useState(params.search);

  useEffect(() => {
    if (localSearch === "" && params.search !== "") {
      setParams({
        ...params,
        search: "",
        page: PAGINATION.DEFAULT_PAGE,
      });
      return;
    }

    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams({
          ...params,
          search: localSearch,
          page: PAGINATION.DEFAULT_PAGE,
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localSearch, params, setParams, debounceMs]);

  useEffect(() => {
    setLocalSearch(params.search);
  }, [params.search]);

  return {
    searchValue: localSearch,
    onSearchChange: setLocalSearch,
  };
}
