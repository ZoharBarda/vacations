import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import aiService from "../services/aiService";
import type { ChatMessage, ChatState } from "../models/chat";

const initialState: ChatState = {
  loading: false,
  error: null,
  messages: [],
};

export const askAiRecommendationThunk = createAsyncThunk(
  "ai/ask",
  async (destination: string) => {
    return aiService.getRecommendation(destination);
  }
);

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearAiChat(state) {
      state.messages = [];
      state.error = null;
    },
    addAiUserMessage(state, action: { payload: ChatMessage }) {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askAiRecommendationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(askAiRecommendationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: crypto.randomUUID(),
          role: "assistant",
          text: action.payload,
          createdAt: new Date().toISOString(),
        });
      })
      .addCase(askAiRecommendationThunk.rejected, (state) => {
        state.loading = false;
        state.error = "Could not get recommendation";
      });
  },
});

export const { clearAiChat, addAiUserMessage } = aiSlice.actions;
export default aiSlice.reducer;
