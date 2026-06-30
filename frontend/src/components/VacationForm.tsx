import { useEffect, useState } from "react";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import type { VacationFormValues } from "../models/vacation";

interface VacationFormProps {
  initialValues?: Partial<VacationFormValues>;
  submitText: string;
  allowPastStartDate?: boolean;
  onSubmit: (values: VacationFormValues) => void;
}

const VacationForm = ({
  initialValues,
  submitText,
  allowPastStartDate = false,
  onSubmit,
}: VacationFormProps) => {
  const [destination, setDestination] = useState(initialValues?.destination || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [startDate, setStartDate] = useState(initialValues?.startDate || "");
  const [endDate, setEndDate] = useState(initialValues?.endDate || "");
  const [price, setPrice] = useState(initialValues?.price?.toString() || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setDestination(initialValues?.destination || "");
    setDescription(initialValues?.description || "");
    setStartDate(initialValues?.startDate || "");
    setEndDate(initialValues?.endDate || "");
    setPrice(initialValues?.price?.toString() || "");
  }, [initialValues]);

  const validate = () => {
    const validationErrors: string[] = [];
    const numericPrice = Number(price);
    const today = new Date().toISOString().slice(0, 10);

    if (!destination.trim()) validationErrors.push("Destination is required");
    if (!description.trim()) validationErrors.push("Description is required");
    if (!startDate) validationErrors.push("Start date is required");
    if (!endDate) validationErrors.push("End date is required");
    if (price === "") validationErrors.push("Price is required");

    if (Number.isNaN(numericPrice) || numericPrice < 0 || numericPrice > 10000) {
      validationErrors.push("Price must be between 0 and 10000");
    }

    if (startDate && endDate && endDate < startDate) {
      validationErrors.push("End date must be greater than or equal to start date");
    }

    if (!allowPastStartDate && startDate && startDate < today) {
      validationErrors.push("Past start dates are not allowed");
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    onSubmit({
      destination,
      description,
      startDate,
      endDate,
      price: Number(price),
      imageFile,
      imageFileName: initialValues?.imageFileName,
    });
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <Stack component="form" spacing={2} onSubmit={handleSubmit}>
        <TextField label="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
        <TextField
          label="Description"
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Start Date"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="End Date"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          slotProps={{ htmlInput: { min: 0, max: 10000, step: "0.01" } }}
        />

        <Button variant="outlined" component="label">
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </Button>

        {initialValues?.imageFileName && (
          <Typography variant="caption">Current image: {initialValues.imageFileName}</Typography>
        )}

        {errors.length > 0 && (
          <Paper sx={{ p: 2, bgcolor: "error.light", color: "error.contrastText" }}>
            {errors.map((error) => (
              <Typography key={error} variant="body2">
                {error}
              </Typography>
            ))}
          </Paper>
        )}

        <Button type="submit" variant="contained" color="secondary" size="large">
          {submitText}
        </Button>
      </Stack>
    </Paper>
  );
};

export default VacationForm;
