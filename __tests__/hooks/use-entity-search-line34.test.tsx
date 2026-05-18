import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { PAGINATION } from "@/config/constants";

describe("useEntitySearch Coverage Extensions", () => {
  it("should reset search and page when localSearch becomes empty but params.search is not", () => {
    const setParams = vi.fn();
    const initialParams = { search: "initial", page: 5 };
    
    const { result } = renderHook(() => useEntitySearch({
      params: initialParams,
      setParams,
    }));

    // Line 34: localSearch === "" && params.search !== ""
    act(() => {
      result.current.onSearchChange("");
    });

    expect(setParams).toHaveBeenCalledWith({
      ...initialParams,
      search: "",
      page: PAGINATION.DEFAULT_PAGE,
    });
  });
});
