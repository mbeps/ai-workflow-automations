import { createLoader } from "nuqs/server";
import { credentialsParams } from "../params";

/**
 * Server-side URL parameter loader for credentials list page.
 * Decodes pagination and search state from query string for Server Components.
 * Integrates with `nuqs` for type-safe query parameter management.
 * 
 * @author Maruf Bepary
 */
export const credentialsParamsLoader = createLoader(credentialsParams);
