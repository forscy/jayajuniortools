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
import DashboardLayout, {
  navigationItems,
} from "../components/layout/DashboardLayout";
import CategoryDashboardPage from "../pages/dashboard/CategoryDashboardPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import UnderMaintenancePage from "../pages/UnderMaintenancePage";
import DetailProductPage from "../pages/DetailProductPageNew";
import AddProductPage from "../pages/dashboard/AddProductPage";
import POSPage from "../pages/TransactionPage";

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
          <Route path="/products/:id" element={<DetailProductPage />} />

          {/* Routes yang memerlukan autentikasi */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/cart" element={<PlaceholderPage />} />
          </Route>

          <Route
            path="/shopkeeper/*"
            element={
              <ProtectedRoute allowedRoles={[Role.OWNER, Role.SHOPKEEPER]}>
                <Routes>
                  <Route index element={<PlaceholderPage />} />
                  <Route path="/transaction" element={<POSPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Routes yang memerlukan role spesifik */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute
                allowedRoles={[Role.OWNER, Role.INVENTORY_MANAGER]}
              >
                <Routes>
                  <Route index element={<DashboardPage />} />
                  <Route
                    path={navigationItems.dashboard.path}
                    element={<DashboardPage />}
                  />
                  <Route
                    path={navigationItems.products.path}
                    element={<ProductDashboardPage />}
                  />
                  <Route
                    path={navigationItems.categories.path}
                    element={<CategoryDashboardPage />}
                  />
                  <Route
                    path={navigationItems.discounts.path}
                    element={
                      <DashboardLayout
                        title=""
                        children={<UnderMaintenancePage />}
                      />
                    }
                  />
                  <Route
                    path={navigationItems.stores.path}
                    element={
                      <DashboardLayout
                        title=""
                        children={<UnderMaintenancePage />}
                      />
                    }
                  />
                  <Route
                    path={navigationItems.orders.path}
                    element={
                      <DashboardLayout
                        title=""
                        children={<UnderMaintenancePage />}
                      />
                    }
                  />
                  <Route
                    path={navigationItems.users.path}
                    element={
                      <DashboardLayout
                        title=""
                        children={<UnderMaintenancePage />}
                      />
                    }
                  />

                  <Route
                    path="/products/add"
                    element={
                      <DashboardLayout
                        title="Add Products Page"
                        children={<AddProductPage />}
                      />
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </CssVarsProvider>
  );
};

export default AppRoutes;
