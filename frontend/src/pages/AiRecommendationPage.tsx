import { useState } from "react";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { addAiUserMessage, askAiRecommendationThunk } from "../redux/aiSlice";
import Loader from "../components/Loader";

const AiRecommendationPage = () => {
  const dispatch = useAppDispatch();
  const { messages, loading } = useAppSelector((state) => state.ai);
  const [destination, setDestination] = useState("");

  const onAsk = async () => {
    if (!destination.trim()) return;
    dispatch(
      addAiUserMessage({
        id: crypto.randomUUID(),
        role: "user",
        text: destination,
        createdAt: new Date().toISOString(),
      })
    );
    await dispatch(askAiRecommendationThunk(destination));
    setDestination("");
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
        AI Destination Recommendation
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Where do you want to go?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <Button variant="contained" color="secondary" onClick={onAsk}>
          Ask AI
        </Button>
      </Stack>

      {loading && <Loader />}

      <Stack spacing={1}>
        {messages.map((message) => (
          <motion.div key={message.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                ml: message.role === "assistant" ? 0 : "auto",
                maxWidth: "80%",
                bgcolor: message.role === "assistant" ? "background.paper" : "secondary.main",
                color: message.role === "assistant" ? "text.primary" : "secondary.contrastText",
              }}
            >
              <Typography>{message.text}</Typography>
            </Paper>
          </motion.div>
        ))}
      </Stack>
    </Box>
  );
};

export default AiRecommendationPage;
