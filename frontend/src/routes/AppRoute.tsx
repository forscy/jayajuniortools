// src/routes/AppRoutes.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Role } from "../types/index";
import SignInPage from "../pages/SignInPage";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";
import PlaceholderPage from "../pages/PlaceholderPage";
import SignUpPage from "../pages/SignUpPage";
import UserProfilePage from "../pages/UserProfilePage";
import ProductsPage from "../pages/ProductsPage";
import { CssVarsProvider } from "@mui/joy";
import ProductDashboardPage from "../pages/dashboard/ProductDashboardPage";
import { navigationItems } from "../components/layout/DashboardLayout";
import CategoryDashboardPage from "../pages/dashboard/CategoryDashboardPage";

const AppRoutes: React.FC = () => {
  return (
    <CssVarsProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes publik */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/cart"
            element={<PlaceholderPage pageTitle="Cart Page" />}
          />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/products" element={<ProductsPage />} />

          {/* Routes yang memerlukan autentikasi */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/cart" element={<PlaceholderPage />} />
          </Route>

          {/* Routes yang memerlukan role spesifik */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[Role.OWNER, Role.INVENTORY_MANAGER]}
              />
            }
          >
            <Route path={navigationItems.dashboard.path} element={<ProductDashboardPage />} />
            <Route path={navigationItems.products.path} element={<ProductDashboardPage />} />
            <Route path={navigationItems.categories.path} element={<CategoryDashboardPage />} />
            <Route
              path="/products/add"
              element={<PlaceholderPage pageTitle="Add Products Page" />}
            />
          </Route>

          {/* Redirect dari root ke dashboard jika sudah login */}
          {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </CssVarsProvider>
  );
};

export default AppRoutes;
