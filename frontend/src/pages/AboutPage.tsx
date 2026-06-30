import { Box, Paper, Stack, Typography } from "@mui/material";

const AboutPage = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            About VacationFlow
          </Typography>
          <Typography>
            VacationFlow is a full travel-vacation management platform with user likes,
            role-based admin features, AI recommendations, and data insights.
          </Typography>
          <Typography>
            Developer: Zohar Barda. Built with React, TypeScript, Redux Toolkit,
            React Router, Material UI, and Recharts.
          </Typography>
          <Typography>
            About me: Zohar Barda, 24 years old, John Bryce student.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AboutPage;
