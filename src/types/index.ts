// Payload que va dentro del token JWT
export interface JwtPayload {
  userId: string;
  role: "admin" | "user";
}

// Request autenticado — extiende el Request de Express agregando el usuario
export interface AuthRequest extends Request {
  user?: JwtPayload;
}
