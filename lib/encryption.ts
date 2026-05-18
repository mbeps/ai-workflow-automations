import Cryptr from "cryptr";
import { env } from "@/lib/env";

const cryptr = new Cryptr(env.ENCRYPTION_KEY);

/**
 * Encrypts a string using AES-256-GCM.
 * Used for storing sensitive AI provider credentials at rest.
 *
 * @author Maruf Bepary
 * @param text The plaintext string to encrypt.
 * @returns The encrypted string in hex format.
 */
export const encrypt = (text: string) => cryptr.encrypt(text);

/**
 * Decrypts a hex string back into plaintext.
 * Used at execution time to retrieve AI provider API keys.
 *
 * @author Maruf Bepary
 * @param text The encrypted hex string.
 * @returns The decrypted plaintext string.
 */
export const decrypt = (text: string) => cryptr.decrypt(text);
