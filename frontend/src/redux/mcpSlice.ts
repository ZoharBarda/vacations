import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import mcpService from "../services/mcpService";
import type { ChatMessage, ChatState } from "../models/chat";

const initialState: ChatState = {
  loading: false,
  error: null,
  messages: [],
};

export const askMcpThunk = createAsyncThunk("mcp/ask", async (question: string) => {
  return mcpService.ask(question);
});

const mcpSlice = createSlice({
  name: "mcp",
  initialState,
  reducers: {
    clearMcpChat(state) {
      state.messages = [];
      state.error = null;
    },
    addMcpUserMessage(state, action: { payload: ChatMessage }) {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askMcpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(askMcpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: crypto.randomUUID(),
          role: "assistant",
          text: action.payload,
          createdAt: new Date().toISOString(),
        });
      })
      .addCase(askMcpThunk.rejected, (state) => {
        state.loading = false;
        state.error = "Could not get MCP answer";
      });
  },
});

export const { clearMcpChat, addMcpUserMessage } = mcpSlice.actions;
export default mcpSlice.reducer;
