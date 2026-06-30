import { Card, CardContent, CardMedia, Typography, Stack, IconButton, Chip, Button } from "@mui/material";
import type { Vacation } from "../models/vacation";

interface VacationCardProps {
  vacation: Vacation;
  isAdmin: boolean;
  onLikeToggle?: (vacationId: number, likedByUser: boolean) => void;
  onEdit?: (vacationId: number) => void;
  onDelete?: (vacationId: number) => void;
}

const VacationCard = ({ vacation, isAdmin, onLikeToggle, onEdit, onDelete }: VacationCardProps) => {
  const imageSrc = vacation.ImageFileName
    ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/uploads/${vacation.ImageFileName}`
    : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80&auto=format&fit=crop";

  return (
    <Card sx={{ borderRadius: 3, overflow: "hidden", height: "100%" }}>
      <CardMedia component="img" height="190" image={imageSrc} alt={vacation.Destination} />
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {vacation.Destination}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 60 }}>
            {vacation.Description}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Chip size="small" label={`Start: ${vacation.StartDate.slice(0, 10)}`} />
            <Chip size="small" label={`End: ${vacation.EndDate.slice(0, 10)}`} />
            <Chip size="small" color="secondary" label={`$${Number(vacation.Price).toFixed(2)}`} />
          </Stack>

          {!isAdmin && (
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <IconButton
                  color={vacation.likedByUser ? "error" : "default"}
                  onClick={() => onLikeToggle?.(vacation.VacationID, Boolean(vacation.likedByUser))}
                >
                  {vacation.likedByUser ? "Unlike" : "Like"}
                </IconButton>
                <Typography variant="body2">{vacation.likesCount || 0} Likes</Typography>
              </Stack>
            </Stack>
          )}

          {isAdmin && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => onEdit?.(vacation.VacationID)}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={() => onDelete?.(vacation.VacationID)}
              >
                Delete
              </Button>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default VacationCard;
