import { useState } from "react";
import {
  Box,
  Typography,
  Sheet,
  IconButton,
  Input,
  Button,
  Chip,
  CircularProgress,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/joy";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";

import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";
import ColorSchemeToggle from "./ColorSchemeTogle";
import { useAppDispatch } from "../redux/hooks";
import { Role } from "../types";

interface Category {
  id: number;
  name: string;
}

interface HeaderProps {
  categories?: Category[];
}

export default function Header({ categories }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Navigate to dashboard if user is owner or inventory manager
  const handleDashboardClick = () => {
    navigate("/dashboard/home");
  };

  // Simulasi loading untuk kategori yang dipilih
  const handleCategoryClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    handleProfileMenuClose();
    navigate("/");
  };

  return (
    <>
      <Sheet
        component="header"
        variant="outlined"
        color="neutral"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 9999,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 0,
          boxShadow: "sm",
        }}
      >
        {/* Top Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              variant="outlined"
              color="neutral"
              onClick={toggleMobileMenu}
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography level="h3" component="h1" sx={{ fontWeight: "bold" }}>
              Jaya Junior Tools
            </Typography>
          </Box>

          {/* Main Navigation - New Addition */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, ml: 4 }}>
            <Button variant="plain" color="neutral" component={Link} to="/">
              Home
            </Button>
            <Button
              variant="plain"
              color="neutral"
              component={Link}
              to="/products"
            >
              Products
            </Button>
            <Button
              variant="plain"
              color="neutral"
              component={Link}
              to="/best-sellers"
            >
              Best Sellers
            </Button>
          </Box>

          {/* Search Box - Hidden on mobile */}
          <Box
            component="form"
            sx={{
              display: { xs: "none", sm: "flex" },
              flex: 1,
              maxWidth: 500,
              mx: 2,
            }}
          >
            <Input
              size="md"
              placeholder="Cari produk..."
              startDecorator={<SearchIcon />}
              endDecorator={
                <Button
                  variant="solid"
                  size="sm"
                  sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                >
                  Cari
                </Button>
              }
              sx={{ width: "100%" }}
            />
          </Box>

          {/* User Actions */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton variant="outlined" color="neutral">
              <FavoriteBorderIcon />
            </IconButton>
            <IconButton variant="outlined" color="neutral">
              <ShoppingCartIcon />
            </IconButton>

            {/* Conditional rendering based on auth status */}
            {isAuthenticated && user ? (
              <>
                <IconButton
                  variant="outlined"
                  color="neutral"
                  onClick={
                    // kalo dah kebuka itu close, kalo belum kebuka itu open
                    anchorEl ? handleProfileMenuClose : handleProfileMenuOpen
                  }
                >
                  <Avatar
                    size="sm"
                    alt={user.name}
                    sx={{
                      "--Avatar-size": "30px",
                      border: "2px solid",
                      borderColor: "primary.500",
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  placement="bottom-end"
                  style={{
                    zIndex: 9999,
                  }}
                >
                  <MenuItem disabled>
                    <Typography level="body-sm">{user.email}</Typography>
                  </MenuItem>
                  {/* If Role == Owner or Inventory Manager Show Dashboard Button */}
                  {(user.role === Role.OWNER ||
                    user.role === Role.INVENTORY_MANAGER) && (
                    <MenuItem onClick={handleDashboardClick}>
                      <DashboardIcon sx={{ mr: 1 }} fontSize="small" />
                      Dashboard
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleProfileMenuClose}
                  >
                    <AccountCircleIcon sx={{ mr: 1 }} fontSize="small" />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Link to="/signin" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  color="neutral"
                  startDecorator={<PersonOutlineIcon />}
                  sx={{ display: { xs: "none", sm: "flex" } }}
                >
                  Masuk
                </Button>
              </Link>
            )}

            <ColorSchemeToggle />
          </Box>
        </Box>

        {/* Search Box - Mobile only */}
        <Box
          component="form"
          sx={{
            display: { xs: "flex", sm: "none" },
            p: 1,
            pb: 2,
          }}
        >
          <Input
            size="sm"
            placeholder="Cari produk..."
            startDecorator={<SearchIcon />}
            endDecorator={
              <Button
                size="sm"
                variant="solid"
                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                Cari
              </Button>
            }
            sx={{ width: "100%" }}
          />
        </Box>

        {/* Category Navigation */}
        {categories && categories.length > 0 && (
          <Box
            sx={{
              display: { xs: mobileMenuOpen ? "flex" : "none", md: "flex" },
              gap: 2,
              p: 1.5,
              backgroundColor: "background.level1",
              overflowX: "auto",
              flexWrap: { xs: "wrap", md: "nowrap" },
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            {categories.map((category) => (
              <Chip
                key={category.id}
                onClick={handleCategoryClick}
                variant="soft"
                color="primary"
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "primary.softHover" },
                  minWidth: "fit-content",
                }}
              >
                {category.name}
              </Chip>
            ))}
          </Box>
        )}
      </Sheet>

      {/* Loading Indicator - Shown when loading state is true */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}
    </>
  );
}
