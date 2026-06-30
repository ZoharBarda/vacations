import apiClient from "./apiClient";
import type { AuthResponse, LoginPayload, RegisterPayload } from "../models/auth";

const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("/users", payload);
    return data;
  },

  async checkEmailAvailability(email: string): Promise<boolean> {
    const { data } = await apiClient.get<{ available: boolean }>("/users/check-email", {
      params: { email },
    });
    return data.available;
  },
};

export default authService;
