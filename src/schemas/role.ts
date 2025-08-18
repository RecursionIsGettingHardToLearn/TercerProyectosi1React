import { z } from "zod";

export const roleSchema = z.object({
  nombre: z
    .string()
    .trim() // recorta espacios y mantiene ZodString
    .min(1, "El nombre es obligatorio.")
    .max(10, "El nombre debe tener como máximo 10 caracteres."),
});

export type RoleForm = z.infer<typeof roleSchema>;
