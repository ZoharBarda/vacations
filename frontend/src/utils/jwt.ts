import type { AuthUser, UserRole } from "../models/auth";

interface JwtPayload {
  userId?: number;
  id?: number;
  email?: string;
  role?: string;
  exp?: number;
}

export const jwtDecodeSafe = (token: string): AuthUser | null => {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) {
      return null;
    }
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson) as JwtPayload;
    const role = (payload.role || "user") as UserRole;

    return {
      userId: payload.userId || payload.id || 0,
      email: payload.email || "",
      role,
    };
  } catch {
    return null;
  }
};
