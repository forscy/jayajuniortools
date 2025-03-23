// src/components/layout/DashboardLayout.tsx
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Sheet from "@mui/joy/Sheet";
import Button from "@mui/joy/Button";
import Drawer from "@mui/joy/Drawer";

// Icons
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import GridViewIcon from "@mui/icons-material/GridView";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StoreIcon from "@mui/icons-material/Store";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";

// Navigation items configuration as an object
export const navigationItems = {
  dashboard: {
    path: "/dashboard",
    label: "Dashboard",
    icon: <GridViewIcon />,
    order: 1,
    position: "top", // Special position marker
  },
  products: {
    path: "/dashboard/products",
    label: "Products",
    icon: <InventoryIcon />,
    order: 2,
    position: "top", // Special position marker
  },
  categories: {
    path: "/dashboard/categories",
    label: "Categories",
    icon: <CategoryIcon />,
    order: 3,
    position: "top", // Special position marker
  },
  discounts: {
    path: "/dashboard/discounts",
    label: "Discounts",
    icon: <LocalOfferIcon />,
    order: 4,
    position: "top", // Special position marker
  },
  stores: {
    path: "/dashboard/stores",
    label: "Stores",
    icon: <StoreIcon />,
    order: 5,
    position: "top", // Special position marker
  },
  orders: {
    path: "/dashboard/orders",
    label: "Orders",
    icon: <ReceiptIcon />,
    order: 6,
    position: "top", // Special position marker
  },
  users: {
    path: "/dashboard/users",
    label: "Users",
    icon: <PeopleIcon />,
    order: 7,
    position: "top", // Special position marker
  },
  settings: {
    path: "/settings",
    label: "Settings",
    icon: <SettingsIcon />,
    order: 8,
    position: "bottom", // Special position marker
  },
};

// Components
function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();
  return (
    <IconButton
      variant="soft"
      color="neutral"
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
    >
      {mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
    </IconButton>
  );
}

function SidebarNav({
  onClose,
  currentPath,
}: {
  onClose?: () => void;
  currentPath: string;
}) {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      // For dashboard, only match exact path to prevent highlighting when on subpaths
      return currentPath === "/dashboard" || currentPath === "/dashboard/";
    }
    // For other items, check if currentPath includes the path
    return currentPath.includes(path);
  };

  // Get main navigation items (not positioned at bottom)
  const mainNavItems = Object.values(navigationItems)
    .filter((item) => item.position !== "bottom")
    .sort((a, b) => a.order - b.order);

  // Get bottom navigation items
  const bottomNavItems = Object.values(navigationItems)
    .filter((item) => item.position === "bottom")
    .sort((a, b) => a.order - b.order);

  return (
    <Sheet
      sx={{
        width: { xs: 240, lg: 240 },
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
        borderRight: { xs: 0, sm: "1px solid" },
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <StoreIcon />
        <Typography level="h4">Jaya Junior Tools</Typography>
      </Box>

      {mainNavItems.map((item) => (
        <Button
          key={item.path}
          variant={isActive(item.path) ? "solid" : "soft"}
          color={isActive(item.path) ? "primary" : "neutral"}
          startDecorator={item.icon}
          sx={{ justifyContent: "flex-start" }}
          onClick={() => handleNavigation(item.path)}
        >
          {item.label}
        </Button>
      ))}

      <Box sx={{ flexGrow: 1 }} />

      {bottomNavItems.map((item) => (
        <Button
          key={item.path}
          variant={isActive(item.path) ? "solid" : "soft"}
          color={isActive(item.path) ? "primary" : "neutral"}
          startDecorator={item.icon}
          sx={{ justifyContent: "flex-start" }}
          onClick={() => handleNavigation(item.path)}
        >
          {item.label}
        </Button>
      ))}
    </Sheet>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function DashboardLayout({
  children,
  title,
}: DashboardLayoutProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const location = useLocation();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <CssVarsProvider defaultMode="system">
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Desktop sidebar */}
        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            flexShrink: 0,
          }}
        >
          <SidebarNav currentPath={location.pathname} />
        </Box>

        {/* Mobile drawer */}
        <Drawer
          size="md"
          variant="plain"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{ display: { lg: "none" } }}
        >
          <SidebarNav onClose={toggleDrawer} currentPath={location.pathname} />
        </Drawer>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                sx={{ display: { xs: "inline-flex", lg: "none" } }}
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
              <Typography level="h3" sx={{ fontSize: { xs: "xl", sm: "2xl" } }}>
                {title}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <ColorSchemeToggle />
            </Box>
          </Box>

          <Box sx={{ p: { xs: 1, sm: 2 }, flex: 1 }}>{children}</Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
