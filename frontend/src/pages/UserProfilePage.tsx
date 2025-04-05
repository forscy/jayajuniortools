import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Grid,
  Table,
  Sheet,
  Button,
  IconButton,
  AspectRatio,
  Chip,
  Badge,
  Divider,
  CircularProgress,
} from "@mui/joy";
import {
  Person,
  ShoppingBag,
  Star,
  Favorite,
  Edit,
  Notifications,
  Settings,
  Logout,
  ArrowForward,
  DeleteOutline,
  ShoppingCart,
} from "@mui/icons-material";
import { useTheme } from "@mui/joy/styles";
import { useMediaQuery } from "@mui/material";
import { Role, UserDTO, UserStatus } from "../dto/user.dto";
import { OrderDTO } from "../dto/order.dto";
import { ReviewDTO } from "../dto/product.dto";

// Utility functions
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getStatusColor = (status: string) => {
  const statusMap: Record<
    string,
    "success" | "warning" | "danger" | "primary" | "neutral"
  > = {
    [UserStatus.ACTIVE]: "success",
    [UserStatus.INACTIVE]: "neutral",
    [UserStatus.SUSPENDED]: "danger",
    // [OrderStatus.PENDING]: "neutral",
    // [OrderStatus.PROCESSED]: "primary",
    // [OrderStatus.SHIPPED]: "warning",
    // [OrderStatus.COMPLETED]: "success",
    // [OrderStatus.CANCELLED]: "danger",
  };
  return statusMap[status] || "neutral";
};

// Component for profile card
const ProfileCard = ({ user, notifications, formatDate }: any) => (
  <Card variant="outlined" sx={{ mb: 3, height: "100%" }}>
    <CardContent sx={{ textAlign: "center" }}>
      <Box sx={{ position: "relative", mb: 2, display: "inline-block" }}>
        <Badge
          badgeContent={user.status}
          size="sm"
          color={getStatusColor(user.status)}
          sx={{ position: "absolute", bottom: 0, right: 0 }}
        >
          <Avatar
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
            sx={{ width: 100, height: 100, mx: "auto", mb: 1 }}
          />
        </Badge>
      </Box>
      <Typography level="h4">{user.name}</Typography>
      <Typography level="body-sm" sx={{ mb: 2 }}>
        {user.email}
      </Typography>

      <Chip color="primary" variant="soft" size="md" sx={{ mb: 2 }}>
        {user.role.replace("_", " ")}
      </Chip>

      <Typography
        level="body-sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        Member since {formatDate(user.createdAt)}
      </Typography>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="outlined"
          color="neutral"
          startDecorator={<Edit />}
          size="sm"
        >
          Edit Profile
        </Button>
        <Badge badgeContent={notifications} color="danger">
          <IconButton variant="soft" color="primary">
            <Notifications />
          </IconButton>
        </Badge>
      </Box>
    </CardContent>
  </Card>
);

// Component for quick actions
const QuickActionsCard = () => (
  <Card variant="outlined" sx={{ height: "100%" }}>
    <CardContent>
      <Typography level="title-md" sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Button variant="soft" color="primary" startDecorator={<ShoppingBag />}>
          My Orders
        </Button>
        <Button variant="soft" color="neutral" startDecorator={<Favorite />}>
          Wishlist
        </Button>
        <Button variant="soft" color="neutral" startDecorator={<Settings />}>
          Account Settings
        </Button>
        <Button variant="outlined" color="danger" startDecorator={<Logout />}>
          Logout
        </Button>
      </Box>
    </CardContent>
  </Card>
);

// Component for profile info tab
const ProfileInfoPanel = ({ user, orders, reviews, wishlist }: any) => (
  <>
    <Typography level="h4" sx={{ mb: 2 }}>
      Account Information
    </Typography>
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid xs={12} sm={6}>
        <Typography level="title-sm">Full Name</Typography>
        <Typography>{user.name}</Typography>
      </Grid>
      <Grid xs={12} sm={6}>
        <Typography level="title-sm">Email</Typography>
        <Typography>{user.email}</Typography>
      </Grid>
      <Grid xs={12} sm={6}>
        <Typography level="title-sm">Account Status</Typography>
        <Chip color={getStatusColor(user.status)} size="sm">
          {user.status}
        </Chip>
      </Grid>
      <Grid xs={12} sm={6}>
        <Typography level="title-sm">Role</Typography>
        <Typography>{user.role.replace("_", " ")}</Typography>
      </Grid>
    </Grid>

    <Typography level="h4" sx={{ mb: 2 }}>
      Activity Summary
    </Typography>
    <Grid container spacing={2}>
      <Grid xs={12} sm={4}>
        <Card variant="soft" color="primary" sx={{ textAlign: "center" }}>
          <CardContent>
            <ShoppingBag sx={{ fontSize: 40, mb: 1 }} />
            <Typography level="h4">{orders.length}</Typography>
            <Typography level="body-sm">Orders Placed</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid xs={12} sm={4}>
        <Card variant="soft" color="warning" sx={{ textAlign: "center" }}>
          <CardContent>
            <Star sx={{ fontSize: 40, mb: 1 }} />
            <Typography level="h4">{reviews.length}</Typography>
            <Typography level="body-sm">Reviews Given</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid xs={12} sm={4}>
        <Card variant="soft" color="danger" sx={{ textAlign: "center" }}>
          <CardContent>
            <Favorite sx={{ fontSize: 40, mb: 1 }} />
            <Typography level="h4">{wishlist.length}</Typography>
            <Typography level="body-sm">Wishlist Items</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </>
);

// Component for orders tab
const OrdersPanel = ({ orders, formatDate, isMobile }: any) => (
  <>
    <Typography level="h4" sx={{ mb: 2 }}>
      Order History
    </Typography>
    {orders.length > 0 ? (
      <Sheet variant="outlined">
        <Table stickyHeader hoverRow>
          <thead>
            <tr>
              <th style={{ width: isMobile ? "40%" : "30%" }}>Order ID</th>
              <th style={{ width: isMobile ? "30%" : "25%" }}>Date</th>
              {!isMobile && <th style={{ width: "20%" }}>Amount</th>}
              <th style={{ width: isMobile ? "30%" : "15%" }}>Status</th>
              {!isMobile && <th style={{ width: "10%" }}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((order: OrderDTO) => (
              <tr key={order.id}>
                <td>#{order.id.toString().padStart(5, "0")}</td>
                <td>{formatDate(order.createdAt)}</td>
                {!isMobile && (
                  <td>Rp {order.totalAmount?.toLocaleString("id-ID")}</td>
                )}
                <td>
                  <Chip
                    size="sm"
                    variant="soft"
                    color={getStatusColor(order.status)}
                  >
                    {order.status}
                  </Chip>
                </td>
                {!isMobile && (
                  <td>
                    <IconButton variant="plain" color="neutral" size="sm">
                      <ArrowForward />
                    </IconButton>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    ) : (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <Typography level="body-lg">No orders found</Typography>
      </Box>
    )}

    {isMobile && orders.length > 0 && (
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button size="sm" variant="outlined">
          View All Orders
        </Button>
      </Box>
    )}
  </>
);

// Component for reviews tab
const ReviewsPanel = ({ reviews, formatDate }: any) => {
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          sx={{
            color: i < rating ? "warning.400" : "neutral.300",
            fontSize: "md",
          }}
        />
      ));
  };

  return (
    <>
      <Typography level="h4" sx={{ mb: 2 }}>
        My Reviews
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <Typography level="body-lg">No reviews yet</Typography>
      </Box>
    </>
  );
};

const UserProfilePage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [notifications, setNotifications] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Mock data - this would be replaced with actual API calls
  useEffect(() => {
    // Simulate API calls
    setLoading(true);
    setTimeout(() => {
      setUser({
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        status: UserStatus.ACTIVE,
        createdAt: "2023-01-15T00:00:00Z",
        updatedAt: "2023-01-15T00:00:00Z",
        role: Role.BUYER,
      });

      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography level="body-lg">Loading profile...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Typography level="h4">Profile not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1200px", mx: "auto" }}>
      <Grid container spacing={3}>
        {/* Left Sidebar */}
        <Grid xs={12} md={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <ProfileCard
              user={user}
              notifications={notifications}
              formatDate={formatDate}
            />
            <QuickActionsCard />
          </Box>
        </Grid>

        {/* Main Content */}
        <Grid xs={12} md={8}>
          <Card variant="outlined">
            <Tabs
              value={tabIndex}
              onChange={(_, value) => setTabIndex(value as number)}
              sx={{ borderRadius: "md" }}
            >
              <TabList sx={{ overflow: "auto" }}>
                <Tab>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Person /> Profile
                  </Box>
                </Tab>
                <Tab>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ShoppingBag /> Orders
                  </Box>
                </Tab>
                <Tab>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Star /> Reviews
                  </Box>
                </Tab>
                <Tab>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Favorite /> Wishlist
                  </Box>
                </Tab>
              </TabList>

              <TabPanel value={0}>
                <ProfileInfoPanel
                  user={user}
                  orders={orders}
                  reviews={reviews}
                />
              </TabPanel>

              <TabPanel value={1}>
                <OrdersPanel
                  orders={orders}
                  formatDate={formatDate}
                  isMobile={isMobile}
                />
              </TabPanel>

              <TabPanel value={2}>
                <ReviewsPanel reviews={reviews} formatDate={formatDate} />
              </TabPanel>
            </Tabs>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfilePage;
