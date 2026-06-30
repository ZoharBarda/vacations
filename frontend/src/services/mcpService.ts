import apiClient from "./apiClient";

const mcpService = {
  async ask(question: string): Promise<string> {
    const { data } = await apiClient.post<{ answer: string }>("/mcp/chat", { question });
    return data.answer;
  },
};

export default mcpService;
