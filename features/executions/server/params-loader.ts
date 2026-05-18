/**
 * Server-side loader for execution list URL parameters.
 * Used in Server Components and layouts to parse query string parameters.
 * Enables SSR-compatible pagination and filtering.
 *
 * @author Maruf Bepary
 */

import { createLoader } from "nuqs/server";
import { executionsParams } from "../params";

/**
 * Loader instance for parsing execution list parameters from query string.
 * Pass to useSearchParams hook in Client Components or to function arguments in Server Components.
 */
export const executionsParamsLoader = createLoader(executionsParams);
