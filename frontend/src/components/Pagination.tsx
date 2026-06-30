import { Pagination as MuiPagination, Stack } from "@mui/material";

interface PaginationProps {
  page: number;
  pagesCount: number;
  onChange: (page: number) => void;
}

const Pagination = ({ page, pagesCount, onChange }: PaginationProps) => {
  if (pagesCount <= 1) {
    return null;
  }

  return (
    <Stack sx={{ alignItems: "center", py: 3 }}>
      <MuiPagination
        count={pagesCount}
        page={page}
        color="secondary"
        onChange={(_, nextPage) => onChange(nextPage)}
      />
    </Stack>
  );
};

export default Pagination;
