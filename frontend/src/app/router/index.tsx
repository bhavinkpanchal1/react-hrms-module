// src/app/router/index.tsx — complete fixed version
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "../layouts/dashboard/DashboardLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import React, { lazy, Suspense } from "react";

// ── Page-level code splitting ─────────────────────────────────────
const LoginPage = lazy(() => import("@/modules/auth/pages/LoginPage"));
const EmployeeListPage = lazy(
  () => import("@/modules/employee/pages/EmployeeListPage"),
);
const EmployeeCreatePage = lazy(
  () => import("@/modules/employee/pages/EmployeeCreatePage"),
);

// Recruitment — ALL routes lazy-loaded correctly
const JobsPage = lazy(() => import("@/modules/recruitment/pages/JobsPage"));

//Candidate
const CandidatesPage = lazy(
  () => import("@/modules/recruitment/pages/CandidatesPage"),
);
const CandidateCreatePage = lazy(
  () => import("@/modules/recruitment/pages/candidate/CandidateCreatePage"),
);
const CandidateDetailPage = lazy(
  () => import("@/modules/recruitment/pages/candidate/CandidateDetailsPage"),
);
const CandidateEditPage = lazy(
  () => import("@/modules/recruitment/pages/candidate/CandidateEditPage"),
);

const PipelinePage = lazy(
  () => import("@/modules/recruitment/pages/PipelinePage"),
);
const InterviewsPage = lazy(
  () => import("@/modules/recruitment/pages/InterviewsPage"),
);
const OffersPage = lazy(() => import("@/modules/recruitment/pages/OffersPage"));

// ── Suspense wrapper ──────────────────────────────────────────────
export const PageLoader = () => (
  <div className="grid h-full min-h-[60vh] place-items-center">
    <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const lazy_ = (el: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{el}</Suspense>
);

// ── Router ────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  // Public
  {
    element: <AuthLayout />,
    children: [{ path: "/login", element: lazy_(<LoginPage />) }],
  },

  // Protected
  {
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/recruitment/jobs" replace /> },

      // Employee
      { path: "/employees", element: lazy_(<EmployeeListPage />) },
      { path: "/employees/new", element: lazy_(<EmployeeCreatePage />) },

      // Recruitment — 5 routes, all correctly lazy-loaded
      { path: "/recruitment/jobs", element: lazy_(<JobsPage />) },
      {
        path: "/recruitment/candidates",
        element: <Outlet />,
        children: [
          { index: true, element: lazy_(<CandidatesPage />) },
          { path: "new", element: lazy_(<CandidateCreatePage />) },
          { path: ":id", element: lazy_(<CandidateDetailPage />) },
          { path: ":id/edit", element: lazy_(<CandidateEditPage />) },
        ],
      },
      { path: "/recruitment/pipeline", element: lazy_(<PipelinePage />) },

      //Interview
      {
        path: "/recruitment/interviews",
        element: <Outlet />,
        children: [
          { index: true, element: lazy_(<InterviewsPage />) },
          //{ path: "schedule", element: lazy_(<ScheduleInterviewPage />) },
          //{path: ":id", element: <div className="card p-6">Schedule Detail page — coming soon</div>},
          //{path: ":id/", element: <div className="card p-6">Edit Schduled Interview page — coming soon</div>},
        ],
      },

      { path: "/recruitment/offers", element: lazy_(<OffersPage />) },

      // Module stubs — replace as you build them
      {
        path: "/dashboard",
        element: <div className="card p-6">Dashboard — coming soon</div>,
      },
      {
        path: "/attendance",
        element: <div className="card p-6">Attendance — coming soon</div>,
      },
      {
        path: "/leave",
        element: <div className="card p-6">Leave — coming soon</div>,
      },
      {
        path: "/payroll",
        element: <div className="card p-6">Payroll — coming soon</div>,
      },
      {
        path: "/settings",
        element: <div className="card p-6">Settings — coming soon</div>,
      },
    ],
  },

  // Fallback
  { path: "*", element: <Navigate to="/recruitment/jobs" replace /> },
]);
