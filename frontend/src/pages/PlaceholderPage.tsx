import React from "react";
import { Box, Typography, Card, Button } from "@mui/joy";
import ConstructionIcon from "@mui/icons-material/Construction";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

interface PlaceholderPageProps {
  pageTitle?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  pageTitle = "Under Construction",
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        p: 3,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          maxWidth: 500,
          textAlign: "center",
          p: 4,
          boxShadow: "md",
        }}
      >
        <ConstructionIcon sx={{ fontSize: 60, color: "warning.500", mb: 2 }} />

        <Typography level="h2" sx={{ mb: 2 }}>
          {pageTitle}
        </Typography>

        <Typography sx={{ mb: 3 }}>
          Sorry, this page is still being developed. Please check back later or
          go back to the previous page.
        </Typography>

        <Button
          startDecorator={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="solid"
          color="primary"
        >
          Go Back
        </Button>
      </Card>
    </Box>
  );
};

export default PlaceholderPage;
