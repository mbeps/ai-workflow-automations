/**
 * Structured logger utility.
 * Centralizes application logging and provides clean, structured console output.
 *
 * @author Maruf Bepary
 */
export const logger = {
  debug: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[DEBUG]", ...args);
    }
  },
  info: (...args: unknown[]) => {
    console.info("[INFO]", ...args);
  },
  warn: (...args: unknown[]) => {
    console.warn("[WARN]", ...args);
  },
  error: (...args: unknown[]) => {
    console.error("[ERROR]", ...args);
  },
};
