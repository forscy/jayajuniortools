import React from "react";
import { Box, Typography, Button, Container, Stack } from "@mui/joy";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={3}
        textAlign="center"
      >
        <Typography
          level="h1"
          fontSize="clamp(4rem, 10vw, 10rem)"
          fontWeight="bold"
        >
          404
        </Typography>

        <Typography level="h3" sx={{ mb: 2 }}>
          Page Not Found
        </Typography>

        <Typography level="body-md" sx={{ mb: 4, maxWidth: 450 }}>
          The page you're looking for doesn't exist or has been moved to another
          URL.
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Button variant="outlined" color="neutral" onClick={handleGoBack}>
            Go Back
          </Button>
          <Button variant="solid" color="primary" onClick={handleGoHome}>
            Go to Home
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
