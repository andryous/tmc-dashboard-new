// File: src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import RequireAuth from "@/lib/RequireAuth";
import "./index.css";

import DashboardLayout from "@/layout/dashboard-layout";
import Dashboard from "@/pages/dashboard";
import Orders from "@/pages/orders";
import Settings from "@/pages/placeholder";
import NewOrder from "@/pages/neworder";
import EditOrder from "@/pages/editorder";
import Customers from "@/pages/customers";
import Consultants from "@/pages/consultants";
import Placeholder from "@/pages/placeholder";
import ArchivedCustomers from "@/pages/archived-customers";
import LoginPage from "@/pages/LoginPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Redirección inicial */}
        <Route index element={<Navigate to="/orders" replace />} />

        {/* Login fuera del layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* Todo lo protegido dentro del layout */}
        <Route path="/" element={<DashboardLayout />}>
          <Route
            path="dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="orders"
            element={
              <RequireAuth>
                <Orders />
              </RequireAuth>
            }
          />
          <Route
            path="orders/new"
            element={
              <RequireAuth>
                <NewOrder />
              </RequireAuth>
            }
          />
          <Route
            path="orders/:id/edit"
            element={
              <RequireAuth>
                <EditOrder />
              </RequireAuth>
            }
          />
          <Route
            path="customers"
            element={
              <RequireAuth>
                <Customers />
              </RequireAuth>
            }
          />
          <Route
            path="consultants"
            element={
              <RequireAuth>
                <Consultants />
              </RequireAuth>
            }
          />
          <Route
            path="archived-customers"
            element={
              <RequireAuth>
                <ArchivedCustomers />
              </RequireAuth>
            }
          />
          <Route
            path="settings"
            element={
              <RequireAuth>
                <Settings title="Settings" />
              </RequireAuth>
            }
          />
          <Route
            path="my-orders"
            element={
              <RequireAuth>
                <Placeholder title="My Orders" />
              </RequireAuth>
            }
          />
          <Route
            path="upcoming-orders"
            element={
              <RequireAuth>
                <Placeholder title="Upcoming" />
              </RequireAuth>
            }
          />
          <Route
            path="completed-orders"
            element={
              <RequireAuth>
                <Placeholder title="Completed" />
              </RequireAuth>
            }
          />
          <Route
            path="pending-actions"
            element={
              <RequireAuth>
                <Placeholder title="Pending Actions" />
              </RequireAuth>
            }
          />
          <Route
            path="statistics"
            element={
              <RequireAuth>
                <Placeholder title="Statistics" />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
