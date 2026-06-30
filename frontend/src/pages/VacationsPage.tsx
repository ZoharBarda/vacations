import { useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";
import { toast } from "react-toastify";
import VacationCard from "../components/VacationCard";
import Loader from "../components/Loader";
import FiltersBar from "../components/FiltersBar";
import Pagination from "../components/Pagination";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchVacationsThunk } from "../redux/vacationsSlice";
import { fetchMyLikesThunk, toggleLikeThunk } from "../redux/likesSlice";
import { applyVacationFilter } from "../utils/vacationFilters";
import type { VacationFilter } from "../models/vacation";

const PER_PAGE = 9;

const VacationsPage = () => {
  const dispatch = useAppDispatch();
  const vacationsState = useAppSelector((state) => state.vacations);
  const likesState = useAppSelector((state) => state.likes);
  const user = useAppSelector((state) => state.auth.user);

  const [filter, setFilter] = useState<VacationFilter>("ALL");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchVacationsThunk());
    dispatch(fetchMyLikesThunk());
  }, [dispatch]);

  const isAdmin = user?.role === "admin" || user?.role === "manager";

  const mergedVacations = useMemo(() => {
    return vacationsState.items.map((v) => ({
      ...v,
      likedByUser: likesState.myLikedVacationIds.includes(v.VacationID),
    }));
  }, [likesState.myLikedVacationIds, vacationsState.items]);

  const filtered = useMemo(
    () => applyVacationFilter(mergedVacations, filter, likesState.myLikedVacationIds),
    [mergedVacations, filter, likesState.myLikedVacationIds]
  );

  const pagesCount = Math.ceil(filtered.length / PER_PAGE) || 1;
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => {
    if (page > pagesCount) {
      setPage(1);
    }
  }, [page, pagesCount]);

  const handleLikeToggle = async (vacationId: number, likedByUser: boolean) => {
    const result = await dispatch(toggleLikeThunk({ vacationId, likedByUser }));
    if (toggleLikeThunk.rejected.match(result)) {
      toast.error("Could not update like state");
      return;
    }
    toast.success(likedByUser ? "Removed from likes" : "Added to likes");
  };

  if (vacationsState.loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
        Explore Vacations
      </Typography>

      {!isAdmin && <FiltersBar filter={filter} onFilterChange={setFilter} />}

      {paginated.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 4 }}>
          <Typography>No vacations found for this filter.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {paginated.map((vacation) => (
            <Grid key={vacation.VacationID} size={{ xs: 12, sm: 6, md: 4 }}>
              <VacationCard
                vacation={vacation}
                isAdmin={isAdmin}
                onLikeToggle={handleLikeToggle}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Pagination page={page} pagesCount={pagesCount} onChange={setPage} />
    </Box>
  );
};

export default VacationsPage;
