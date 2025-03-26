import React from "react";
import { Box, Typography, Sheet, Container, Stack, Button } from "@mui/joy";
import { styled } from "@mui/joy/styles";
import { useNavigate } from "react-router-dom";
import EngineeringIcon from "@mui/icons-material/Engineering";

const MaintenanceWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: theme.vars.palette.background.body,
}));

const UnderMaintenancePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <MaintenanceWrapper>
      <Container maxWidth="md">
        <Sheet
          variant="outlined"
          sx={{
            padding: 4,
            textAlign: "center",
            borderRadius: "md",
            boxShadow: "md",
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Typography level="h2" component="h1" gutterBottom>
              Under Maintenance
            </Typography>
            {/* Ikon Maintenance */}
            <EngineeringIcon sx={{ fontSize: 64 * 2 }} />
            <Typography level="h4" component="h2" gutterBottom>
              We'll be back soon!
            </Typography>
            <Typography level="body-md" sx={{ mb: 2 }}>
              We're currently performing scheduled maintenance to improve our
              services. Please check back later. We apologize for any
              inconvenience.
            </Typography>

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
      </Container>
    </MaintenanceWrapper>
  );
};

export default UnderMaintenancePage;
