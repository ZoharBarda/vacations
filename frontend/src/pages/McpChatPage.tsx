import { useState } from "react";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { addMcpUserMessage, askMcpThunk } from "../redux/mcpSlice";
import Loader from "../components/Loader";

const examples = [
  "כמה חופשות פעילות קיימות?",
  "מה ממוצע מחירי החופשות?",
  "אילו חופשות עתידיות קיימות באירופה?",
];

const McpChatPage = () => {
  const dispatch = useAppDispatch();
  const { messages, loading } = useAppSelector((state) => state.mcp);
  const [question, setQuestion] = useState("");

  const onAsk = async (value?: string) => {
    const text = value || question;
    if (!text.trim()) return;

    dispatch(
      addMcpUserMessage({
        id: crypto.randomUUID(),
        role: "user",
        text,
        createdAt: new Date().toISOString(),
      })
    );

    await dispatch(askMcpThunk(text));
    setQuestion("");
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
        MCP Database Chat
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Ask about the vacations database"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button variant="contained" color="secondary" onClick={() => onAsk()}>
          Send
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
        {examples.map((example) => (
          <Button key={example} variant="outlined" onClick={() => onAsk(example)}>
            {example}
          </Button>
        ))}
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

export default McpChatPage;
