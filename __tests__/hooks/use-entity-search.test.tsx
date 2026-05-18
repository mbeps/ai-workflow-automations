import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEntitySearch } from '@/hooks/use-entity-search';
import { PAGINATION } from '@/config/constants';

describe('useEntitySearch Hook', () => {
  const defaultParams = {
    search: '',
    page: 1,
  };

  const setParamsMock = vi.fn();

  it('should initialize with provided search term', () => {
    const { result } = renderHook(() => 
      useEntitySearch({ 
        params: { ...defaultParams, search: 'initial' }, 
        setParams: setParamsMock 
      })
    );
    expect(result.current.searchValue).toBe('initial');
  });

  it('should update local search value immediately on change', () => {
    const { result } = renderHook(() => 
      useEntitySearch({ params: defaultParams, setParams: setParamsMock })
    );

    act(() => {
      result.current.onSearchChange('new search');
    });

    expect(result.current.searchValue).toBe('new search');
    // setParams should NOT be called immediately due to debounce
    expect(setParamsMock).not.toHaveBeenCalled();
  });

  it('should call setParams with debounced search value', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => 
      useEntitySearch({ params: defaultParams, setParams: setParamsMock, debounceMs: 500 })
    );

    act(() => {
      result.current.onSearchChange('debounced term');
    });

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(setParamsMock).toHaveBeenCalledWith({
      ...defaultParams,
      search: 'debounced term',
      page: PAGINATION.DEFAULT_PAGE,
    });
    vi.useRealTimers();
  });

  it('should handle clearing the search field', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => 
      useEntitySearch({ 
        params: { ...defaultParams, search: 'something' }, 
        setParams: setParamsMock 
      })
    );

    act(() => {
      result.current.onSearchChange('');
    });

    // The clear behavior in the hook is actually handled by an effect when localSearch becomes ""
    // and params.search is not empty.
    
    expect(setParamsMock).toHaveBeenCalledWith({
      ...defaultParams,
      search: '',
      page: PAGINATION.DEFAULT_PAGE,
    });
    vi.useRealTimers();
  });
});
