import apiClient from "./apiClient";
import type { Vacation } from "../models/vacation";

const vacationsService = {
  async getAll(): Promise<Vacation[]> {
    const { data } = await apiClient.get<Vacation[]>("/vacations");
    return data;
  },

  async getById(vacationId: number): Promise<Vacation> {
    const { data } = await apiClient.get<Vacation>(`/vacations/${vacationId}`);
    return data;
  },

  async create(formData: FormData): Promise<{ vacationId: number }> {
    const { data } = await apiClient.post<{ vacationId: number }>("/vacations", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async update(vacationId: number, formData: FormData): Promise<void> {
    await apiClient.put(`/vacations/${vacationId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async remove(vacationId: number): Promise<void> {
    await apiClient.delete(`/vacations/${vacationId}`);
  },
};

export default vacationsService;
