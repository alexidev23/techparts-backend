import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

// Middleware genérico de validación
// Recibe un schema de Zod y valida el body del request
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Formateamos los errores de Zod para que sean legibles
      const errors = result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      res.status(400).json({ message: "Datos inválidos", errors });
      return;
    }

    // Si la validación pasa, reemplazamos el body con los datos validados
    req.body = result.data;
    next();
  };
};
