import { createLoader } from "nuqs/server";
import { workflowsParams } from "../params";

/**
 * Server-side URL query parameter loader for workflows.
 * Created from workflowsParams definition for use in Server Components and Actions.
 * Enables type-safe access to page, pageSize, and search from URL.
 *
 * @author Maruf Bepary
 */
export const workflowsParamsLoader = createLoader(workflowsParams);
