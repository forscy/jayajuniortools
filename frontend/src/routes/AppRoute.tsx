// src/routes/AppRoutes.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Role } from "../types/index";
import SignInPage from "../pages/SignInPage";
// import Register from '../components/Register';
// import Dashboard from '../components/Dashboard';
// import ProductList from '../components/ProductList';
// import AddProduct from '../components/AddProduct';
// import NotFound from '../components/NotFound';
// import Unauthorized from '../components/Unauthorized';
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";
import PlaceholderPage from "../pages/PlaceholderPage";
import SignUpPage from "../pages/SignUpPage";
import UserProfilePage from "../pages/UserProfilePage";

const AppRoutes: React.FC = () => {
  return (
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
  );
};

export default AppRoutes;
