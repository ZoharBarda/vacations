import { useEffect, useMemo, useState } from "react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { deleteVacationThunk, fetchVacationsThunk } from "../redux/vacationsSlice";
import VacationCard from "../components/VacationCard";
import ModalConfirm from "../components/ModalConfirm";
import Loader from "../components/Loader";

const AdminPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, loading } = useAppSelector((state) => state.vacations);

  const [selectedVacationId, setSelectedVacationId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchVacationsThunk());
  }, [dispatch]);

  const sorted = useMemo(
    () => [...items].sort((a, b) => new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime()),
    [items]
  );

  const onDeleteConfirm = async () => {
    if (!selectedVacationId) return;
    const result = await dispatch(deleteVacationThunk(selectedVacationId));
    if (deleteVacationThunk.rejected.match(result)) {
      toast.error("Could not delete vacation");
    } else {
      toast.success("Vacation deleted");
    }
    setSelectedVacationId(null);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ py: 2 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Admin - Manage Vacations</Typography>
        <Button variant="contained" color="secondary" onClick={() => navigate("/admin/vacations/new")}>
          Add Vacation
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {sorted.map((vacation) => (
          <Grid key={vacation.VacationID} size={{ xs: 12, sm: 6, md: 4 }}>
            <VacationCard
              vacation={vacation}
              isAdmin
              onEdit={(id) => navigate(`/admin/vacations/${id}/edit`)}
              onDelete={(id) => setSelectedVacationId(id)}
            />
          </Grid>
        ))}
      </Grid>

      <ModalConfirm
        open={Boolean(selectedVacationId)}
        title="Delete Vacation"
        description="Are you sure you want to delete this vacation? This action cannot be undone."
        onCancel={() => setSelectedVacationId(null)}
        onConfirm={onDeleteConfirm}
      />
    </Box>
  );
};

export default AdminPage;
