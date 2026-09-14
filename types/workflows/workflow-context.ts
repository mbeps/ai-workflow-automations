/**
 * The shared state object passed between nodes during a workflow execution.
 * Maps node outputs to values accessible by downstream nodes.
 *
 * @author Maruf Bepary
 */
export type WorkflowContext = Record<string, unknown>;
