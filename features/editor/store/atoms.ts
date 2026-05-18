import type { ReactFlowInstance } from "@xyflow/react";
import { atom } from "jotai";

/**
 * Atom storing the current React Flow instance for the editor canvas.
 * Allows programmatic control of the viewport and node state from anywhere in the app.
 *
 * @author Maruf Bepary
 */
export const editorAtom = atom<ReactFlowInstance | null>(null);
