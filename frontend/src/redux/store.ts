import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import vacationsReducer from "./vacationsSlice";
import likesReducer from "./likesSlice";
import aiReducer from "./aiSlice";
import mcpReducer from "./mcpSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vacations: vacationsReducer,
    likes: likesReducer,
    ai: aiReducer,
    mcp: mcpReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
