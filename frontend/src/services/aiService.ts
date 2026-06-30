import apiClient from "./apiClient";

const aiService = {
  async getRecommendation(destination: string): Promise<string> {
    const { data } = await apiClient.post<{ recommendation: string }>("/ai/recommendation", {
      destination,
    });
    return data.recommendation;
  },
};

export default aiService;
