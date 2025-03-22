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
} from "@mui/icons-material";
import { useTheme } from "@mui/joy/styles";
import { useMediaQuery } from "@mui/material";
import {
  User,
  Order,
  Review,
  WishlistItem,
  UserStatus,
  OrderStatus,
  Role,
} from "../types";

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
    [OrderStatus.PROCESSED]: "primary",
    [OrderStatus.SHIPPED]: "warning",
    [OrderStatus.COMPLETED]: "success",
    [OrderStatus.CANCELLED]: "danger",
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
            {orders.map((order: Order) => (
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
      {reviews.length > 0 ? (
        <Grid container spacing={2}>
          {reviews.map((review: Review) => (
            <Grid xs={12} key={review.id}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography level="title-md">
                      {review.productName}
                    </Typography>
                    <Typography level="body-xs">
                      {formatDate(review.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    {renderStars(review.rating)}
                  </Box>
                  {review.comment && (
                    <Typography level="body-md">"{review.comment}"</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <Typography level="body-lg">No reviews yet</Typography>
        </Box>
      )}
    </>
  );
};

// Component for wishlist tab
const WishlistPanel = ({ wishlist }: any) => (
  <>
    <Typography level="h4" sx={{ mb: 2 }}>
      My Wishlist
    </Typography>
    {wishlist.length > 0 ? (
      <Grid container spacing={2}>
        {wishlist.map((item: WishlistItem) => (
          <Grid xs={12} sm={6} md={4} key={item.id}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <AspectRatio ratio="1" sx={{ maxWidth: "100%" }}>
                <img
                  src={
                    item.productImage ||
                    `https://source.unsplash.com/random/300x300/?tool&id=${item.productId}`
                  }
                  alt={item.productName}
                  style={{ objectFit: "cover" }}
                />
              </AspectRatio>
              <Divider />
              <CardContent>
                <Typography level="title-md">{item.productName}</Typography>
                <Typography level="body-lg" sx={{ fontWeight: "bold", mb: 2 }}>
                  Rp {item.price.toLocaleString("id-ID")}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button size="sm" color="primary" sx={{ flexGrow: 1 }}>
                    Add to Cart
                  </Button>
                  <IconButton
                    variant="soft"
                    color="danger"
                    aria-label="Delete from wishlist"
                  >
                    <Favorite />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    ) : (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <Typography level="body-lg">Your wishlist is empty</Typography>
      </Box>
    )}
  </>
);

const UserProfilePage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [notifications, setNotifications] = useState<number>(3);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Mock data - this would be replaced with actual API calls
  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setUser({
        name: "John Doe",
        email: "john.doe@example.com",
        status: UserStatus.ACTIVE,
        createdAt: "2023-01-15T00:00:00Z",
        role: Role.BUYER,
      });

      setOrders([
        {
          id: 1,
          status: OrderStatus.PROCESSED,
          createdAt: "2023-05-10T00:00:00Z",
          totalAmount: 150.99,
        },
        {
          id: 2,
          status: OrderStatus.SHIPPED,
          createdAt: "2023-06-15T00:00:00Z",
          totalAmount: 89.5,
        },
        {
          id: 3,
          status: OrderStatus.COMPLETED,
          createdAt: "2023-07-20T00:00:00Z",
          totalAmount: 210.75,
        },
      ]);

      setReviews([
        {
          id: 1,
          productId: 101,
          productName: "Power Drill",
          rating: 5,
          comment: "Great power tool, very durable",
          createdAt: "2023-03-15T00:00:00Z",
        },
        {
          id: 2,
          productId: 102,
          productName: "Wrench Set",
          rating: 4,
          comment: "Good quality for the price",
          createdAt: "2023-04-22T00:00:00Z",
        },
      ]);

      setWishlist([
        {
          id: 1,
          productId: 103,
          productName: "Premium Hammer",
          productImage: "/images/hammer.jpg",
          price: 29.99,
        },
        {
          id: 2,
          productId: 104,
          productName: "Toolbox",
          productImage: "/images/toolbox.jpg",
          price: 79.99,
        },
        {
          id: 3,
          productId: 105,
          productName: "Cordless Screwdriver",
          productImage: "/images/screwdriver.jpg",
          price: 45.5,
        },
      ]);
    }, 500);
  }, []);

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
        <Typography level="h4">Loading profile...</Typography>
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
                  wishlist={wishlist}
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

              <TabPanel value={3}>
                <WishlistPanel wishlist={wishlist} />
              </TabPanel>
            </Tabs>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfilePage;
