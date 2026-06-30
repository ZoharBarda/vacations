import { ToggleButton, ToggleButtonGroup, Stack } from "@mui/material";
import type { VacationFilter } from "../models/vacation";

interface FiltersBarProps {
  filter: VacationFilter;
  onFilterChange: (filter: VacationFilter) => void;
}

const FiltersBar = ({ filter, onFilterChange }: FiltersBarProps) => {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ py: 2 }}>
      <ToggleButtonGroup
        color="secondary"
        value={filter}
        exclusive
        onChange={(_, value) => value && onFilterChange(value)}
      >
        <ToggleButton value="ALL">All Vacations</ToggleButton>
        <ToggleButton value="MY_LIKES">My Likes</ToggleButton>
        <ToggleButton value="ACTIVE">Active</ToggleButton>
        <ToggleButton value="FUTURE">Future</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
};

export default FiltersBar;
