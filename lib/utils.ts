import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with clsx support.
 * Cleans up conflicting Tailwind classes and allows conditional styling.
 *
 * @author Maruf Bepary
 * @param inputs A list of class values, objects, or arrays to merge.
 * @returns A single string of merged tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
