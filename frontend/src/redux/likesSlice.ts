import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import likesService from "../services/likesService";
import { updateVacationLikeState } from "./vacationsSlice";

interface LikesState {
  myLikedVacationIds: number[];
  loading: boolean;
  error: string | null;
}

const initialState: LikesState = {
  myLikedVacationIds: [],
  loading: false,
  error: null,
};

export const fetchMyLikesThunk = createAsyncThunk("likes/fetchMyLikes", async () => {
  return likesService.myLikes();
});

export const toggleLikeThunk = createAsyncThunk(
  "likes/toggle",
  async (
    { vacationId, likedByUser }: { vacationId: number; likedByUser: boolean },
    { dispatch }
  ) => {
    if (likedByUser) {
      await likesService.unlike(vacationId);
      dispatch(updateVacationLikeState({ vacationId, likedByUser: false }));
      return { vacationId, likedByUser: false };
    }

    await likesService.like(vacationId);
    dispatch(updateVacationLikeState({ vacationId, likedByUser: true }));
    return { vacationId, likedByUser: true };
  }
);

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyLikesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyLikesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.myLikedVacationIds = action.payload;
      })
      .addCase(fetchMyLikesThunk.rejected, (state) => {
        state.loading = false;
        state.error = "Could not load likes";
      })
      .addCase(toggleLikeThunk.fulfilled, (state, action) => {
        const { vacationId, likedByUser } = action.payload;
        if (likedByUser) {
          if (!state.myLikedVacationIds.includes(vacationId)) {
            state.myLikedVacationIds.push(vacationId);
          }
          return;
        }
        state.myLikedVacationIds = state.myLikedVacationIds.filter((id) => id !== vacationId);
      });
  },
});

export default likesSlice.reducer;
