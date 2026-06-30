import { useEffect } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchVacationsThunk } from "../redux/vacationsSlice";
import { exportLikesReportCsv } from "../utils/csv";

const ReportsPage = () => {
  const dispatch = useAppDispatch();
  const vacations = useAppSelector((state) => state.vacations.items);

  useEffect(() => {
    dispatch(fetchVacationsThunk());
  }, [dispatch]);

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
        Likes Report
      </Typography>

      <Button variant="contained" color="secondary" onClick={() => exportLikesReportCsv(vacations)}>
        Export CSV
      </Button>

      <Paper sx={{ mt: 2, p: 2, borderRadius: 4, height: 420 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={vacations} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Destination" angle={-25} textAnchor="end" interval={0} height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="likesCount" fill="#ff6f3c" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default ReportsPage;
