import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Vacation, VacationsState } from "../models/vacation";
import vacationsService from "../services/vacationsService";

const initialState: VacationsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchVacationsThunk = createAsyncThunk("vacations/fetchAll", async () => {
  const vacations = await vacationsService.getAll();
  return [...vacations].sort((a, b) =>
    new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime()
  );
});

export const createVacationThunk = createAsyncThunk(
  "vacations/create",
  async (formData: FormData) => {
    await vacationsService.create(formData);
    return vacationsService.getAll();
  }
);

export const updateVacationThunk = createAsyncThunk(
  "vacations/update",
  async ({ vacationId, formData }: { vacationId: number; formData: FormData }) => {
    await vacationsService.update(vacationId, formData);
    return vacationsService.getAll();
  }
);

export const deleteVacationThunk = createAsyncThunk(
  "vacations/delete",
  async (vacationId: number) => {
    await vacationsService.remove(vacationId);
    return vacationId;
  }
);

const vacationsSlice = createSlice({
  name: "vacations",
  initialState,
  reducers: {
    setVacations(state, action: PayloadAction<Vacation[]>) {
      state.items = action.payload;
    },
    updateVacationLikeState(
      state,
      action: PayloadAction<{ vacationId: number; likedByUser: boolean }>
    ) {
      const vacation = state.items.find((v) => v.VacationID === action.payload.vacationId);
      if (!vacation) {
        return;
      }
      const wasLiked = Boolean(vacation.likedByUser);
      vacation.likedByUser = action.payload.likedByUser;
      const baseCount = vacation.likesCount || 0;
      if (action.payload.likedByUser && !wasLiked) {
        vacation.likesCount = baseCount + 1;
      }
      if (!action.payload.likedByUser && wasLiked) {
        vacation.likesCount = Math.max(0, baseCount - 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVacationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVacationsThunk.rejected, (state) => {
        state.loading = false;
        state.error = "Could not load vacations";
      })
      .addCase(createVacationThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateVacationThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(deleteVacationThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((v) => v.VacationID !== action.payload);
      });
  },
});

export const { setVacations, updateVacationLikeState } = vacationsSlice.actions;
export default vacationsSlice.reducer;
