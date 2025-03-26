import React from "react";
import { Box, Typography, Button, Sheet, Stack, Divider } from "@mui/joy";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "background.surface",
        p: 2,
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: "md",
          p: 3,
          boxShadow: "sm",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <ErrorOutlineIcon color="error" sx={{ fontSize: 64 }} />

          <Typography level="h2" color="danger">
            Unauthorized Access
          </Typography>

          <Typography textAlign="center" sx={{ mb: 1 }}>
            You don't have permission to access this page. Please check your
            credentials or contact an administrator.
          </Typography>

          <Divider sx={{ my: 1, width: "100%" }} />

          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Button variant="outlined" color="neutral" onClick={handleGoBack}>
              Go Back
            </Button>
            <Button variant="solid" color="primary" onClick={handleGoHome}>
              Go to Home
            </Button>
          </Stack>
        </Stack>
      </Sheet>
    </Box>
  );
};

export default UnauthorizedPage;
