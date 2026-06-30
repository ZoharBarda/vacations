import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 3, textAlign: "center" }}>
      <Typography variant="body2" color="text.secondary">
        VacationFlow | Built with React + TypeScript + Redux Toolkit
      </Typography>
    </Box>
  );
};

export default Footer;
