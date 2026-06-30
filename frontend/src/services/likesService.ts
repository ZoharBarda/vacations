import apiClient from "./apiClient";

const likesService = {
  async like(vacationId: number): Promise<void> {
    await apiClient.post(`/vacations/${vacationId}/likes`);
  },

  async unlike(vacationId: number): Promise<void> {
    await apiClient.delete(`/vacations/${vacationId}/likes`);
  },

  async myLikes(): Promise<number[]> {
    const { data } = await apiClient.get<{ vacationIds: number[] }>("/likes/me");
    return data.vacationIds;
  },
};

export default likesService;
