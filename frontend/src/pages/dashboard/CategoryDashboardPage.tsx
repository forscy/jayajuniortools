import { Box } from "@mui/joy";
import DashboardLayout from "../../components/layout/DashboardLayout";




export default function CategoryDashboardPage() {


  return (
    <DashboardLayout title="Product Category Management">
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          mb: 2,
          gap: 2,
        }}
      ></Box>
    </DashboardLayout>
  );

}