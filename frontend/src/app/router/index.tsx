import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/dashboard/DashboardLayout";
///import DashboardPage from "@/modules/dashboard/pages/DashboardPage";
//import EmployeePage from "@/modules/employee/pages/EmployeeListPage";
import { AuthLayout } from "../layouts/AuthLayout";
import React, { lazy, Suspense } from "react";

//Page Level Spliting
const LoginPage = lazy(() => import("@/modules/auth/pages/LoginPage"));
const EmployeeListPage = lazy(
  () => import("@/modules/employee/pages/EmployeeListPage"),
);
const EmployeeCreatePage = lazy(
  () => import("@/modules/employee/pages/EmployeeCreatePage"),
);  

//// Simple fullscreen spinner for Suspense fallback
export const PageLoader = () => (
  <div className="grid h-full min-h-[60vh] place-items-center">
    <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const lazy_ = (el: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{el}</Suspense>
);

export const router = createBrowserRouter([
  //Public Route
  {
    element: <AuthLayout />,
    children: [{ path: "/login", element: lazy_(<LoginPage />) }],
  },

  //Protected Routes
  {
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/employees" replace /> },
      // Employee module
      { path: "/employees", element: lazy_(<EmployeeListPage />) },
      { path: "/employees/new", element: lazy_(<EmployeeCreatePage />) },
      // Stubs — remove once modules are built
      {
        path: "/dashboard",
        element: <div className="card p-6">Dashboard coming soon</div>,
      },
      {
        path: "/attendance",
        element: <div className="card p-6">Attendance coming soon</div>,
      },
      {
        path: "/leave",
        element: <div className="card p-6">Leave coming soon</div>,
      },
      {
        path: "/payroll",
        element: <div className="card p-6">Payroll coming soon</div>,
      },
      {
        path: "/recruitment",
        element: <div className="card p-6">Recruitment coming soon</div>,
      },
      {
        path: "/settings",
        element: <div className="card p-6">Settings coming soon</div>,
      },
    ],
  },

  // Fallback
  { path: '*', element: <Navigate to="/employees" replace /> },
]);
