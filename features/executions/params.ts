/**
 * URL parameter definitions for the executions list page.
 * Defines page and pageSize as serializable query string parameters.
 * Used by both client and server components via nuqs.
 *
 * @author Maruf Bepary
 */

import { parseAsInteger } from "nuqs/server";
import { PAGINATION } from "@/config/constants";

/**
 * Execution list page query parameters.
 * Page defaults to 1, pageSize defaults to 10; both clear when set to default.
 * Used by useQueryStates and server-side loader for parameter synchronization.
 */
export const executionsParams = {
  page: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
  pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({ clearOnDefault: true }),
};
