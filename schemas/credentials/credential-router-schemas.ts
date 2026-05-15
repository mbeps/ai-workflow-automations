import { CredentialType } from "@prisma/client";
import { z } from "zod";
import { PAGINATION } from "@/config/constants";

export const credentialIdSchema = z.object({ id: z.string() });

export const credentialUpsertSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(CredentialType),
  value: z.string().min(1, "Value is required"),
});

export const credentialUpdateSchema = credentialUpsertSchema.extend({
  id: z.string(),
});

export const credentialGetManySchema = z.object({
  page: z.number().default(PAGINATION.DEFAULT_PAGE),
  pageSize: z
    .number()
    .min(PAGINATION.MIN_PAGE_SIZE)
    .max(PAGINATION.MAX_PAGE_SIZE)
    .default(PAGINATION.DEFAULT_PAGE_SIZE),
  search: z.string().default(""),
});

export const credentialByTypeSchema = z.object({
  type: z.nativeEnum(CredentialType),
});

export type CredentialIdValues = z.infer<typeof credentialIdSchema>;
export type CredentialUpsertValues = z.infer<typeof credentialUpsertSchema>;
export type CredentialUpdateValues = z.infer<typeof credentialUpdateSchema>;
export type CredentialGetManyValues = z.infer<typeof credentialGetManySchema>;
export type CredentialByTypeValues = z.infer<typeof credentialByTypeSchema>;
