// src/pages/products/DashboardPage.tsx
import * as React from "react";

// Components and Types
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Box, Grid, Card, CardContent, Typography, Chip, LinearProgress, Divider } from "@mui/joy";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";


export default function DashboardPage() {
  
  return (
    <DashboardLayout title="Dashboard">
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard</p>

      {/* Create dummy statistic transaction and money flow */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Statistics Cards */}
        <Grid container spacing={2}>
          <Grid xs={12} sm={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography level="title-md">Total Transactions</Typography>
                <Typography level="h2" sx={{ mt: 1, mb: 1 }}>248</Typography>
                <Chip
                  color="success"
                  variant="soft"
                  startDecorator={<TrendingUpIcon />}
                  size="sm"
                >
                  +12% from last month
                </Chip>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography level="title-md">Revenue</Typography>
                <Typography level="h2" sx={{ mt: 1, mb: 1 }}>$12,450</Typography>
                <Chip
                  color="success"
                  variant="soft"
                  startDecorator={<TrendingUpIcon />}
                  size="sm"
                >
                  +8% from last month
                </Chip>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography level="title-md">Average Order</Typography>
                <Typography level="h2" sx={{ mt: 1, mb: 1 }}>$50.20</Typography>
                <Chip
                  color="danger"
                  variant="soft"
                  startDecorator={<TrendingDownIcon />}
                  size="sm"
                >
                  -3% from last month
                </Chip>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Money Flow */}
        <Card variant="outlined">
          <CardContent>
            <Typography level="title-md" sx={{ mb: 2 }}>Money Flow</Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography level="body-sm" sx={{ mb: 1 }}>Income: $15,200</Typography>
              <LinearProgress
                determinate
                value={70}
                color="success"
                thickness={10}
                sx={{ mb: 2 }}
              />
              
              <Typography level="body-sm" sx={{ mb: 1 }}>Expenses: $10,800</Typography>
              <LinearProgress
                determinate
                value={50}
                color="danger"
                thickness={10}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Typography>
                Net: <Typography color="success" fontWeight="bold" component="span">+$4,400</Typography>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}