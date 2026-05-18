import { parseAsInteger, parseAsString } from "nuqs/server";
import { PAGINATION } from "@/config/constants";

/**
 * URL query parameter definitions for workflows list page.
 * Defines pagination (page, pageSize) and search functionality.
 * Used by nuqs to parse and manage URL state.
 *
 * @author Maruf Bepary
 */
export const workflowsParams = {
  page: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
  pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({ clearOnDefault: true }),
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};
