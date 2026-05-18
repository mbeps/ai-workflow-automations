/**
 * Centralized configuration for application-wide pagination settings.
 * Ensures consistent data fetching limits and defaults across the tRPC layer and UI.
 *
 * @author Maruf Bepary
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 5,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
};
