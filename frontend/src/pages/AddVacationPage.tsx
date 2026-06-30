import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/reduxHooks";
import { createVacationThunk } from "../redux/vacationsSlice";
import VacationForm from "../components/VacationForm";

const AddVacationPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

    const result = await dispatch(createVacationThunk(formData));
    if (createVacationThunk.fulfilled.match(result)) {
      navigate("/admin");
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
        Add Vacation
      </Typography>
      <VacationForm submitText="Create Vacation" onSubmit={onSubmit} />
    </Box>
  );
};

export default AddVacationPage;
