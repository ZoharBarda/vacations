import { Alert } from "@mui/material";

interface ErrorMessageProps {
  message?: string | null;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) {
    return null;
  }

  return <Alert severity="error">{message}</Alert>;
};

export default ErrorMessage;
