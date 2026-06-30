import { useEffect, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchVacationsThunk, updateVacationThunk } from "../redux/vacationsSlice";
import VacationForm from "../components/VacationForm";
import Loader from "../components/Loader";

const EditVacationPage = () => {
  const { id } = useParams();
  const vacationId = Number(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, loading } = useAppSelector((state) => state.vacations);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchVacationsThunk());
    }
  }, [dispatch, items.length]);

  const vacation = useMemo(() => items.find((v) => v.VacationID === vacationId), [items, vacationId]);

  if (loading || !vacation) {
    return <Loader />;
  }

  const onSubmit = async (values: {
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: number;
    imageFile?: File | null;
  }) => {
    const formData = new FormData();
    formData.append("destination", values.destination);
    formData.append("description", values.description);
    formData.append("startDate", values.startDate);
    formData.append("endDate", values.endDate);
    formData.append("price", String(values.price));
    if (values.imageFile) {
      formData.append("image", values.imageFile);
    }

    const result = await dispatch(updateVacationThunk({ vacationId, formData }));
    if (updateVacationThunk.fulfilled.match(result)) {
      navigate("/admin");
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
        Edit Vacation
      </Typography>
      <VacationForm
        submitText="Save Changes"
        allowPastStartDate
        initialValues={{
          destination: vacation.Destination,
          description: vacation.Description,
          startDate: vacation.StartDate.slice(0, 10),
          endDate: vacation.EndDate.slice(0, 10),
          price: Number(vacation.Price),
          imageFileName: vacation.ImageFileName || "",
        }}
        onSubmit={onSubmit}
      />
    </Box>
  );
};

export default EditVacationPage;
