// src/app/router/index.tsx — complete fixed version
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "../layouts/dashboard/DashboardLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import React, { lazy, Suspense } from "react";
import { AuthenticatedRoute, UnauthenticatedRoute } from "@/modules/auth/components/RouteGuards";

// ── Page-level code splitting ─────────────────────────────────────
const loginPage = lazy(() => import("@/modules/auth/pages/LoginPage"));
const employeeListPage = lazy(
  () => import("@/modules/employee/pages/EmployeeListPage"),
);
const employeeCreatePage = lazy(
  () => import("@/modules/employee/pages/EmployeeCreatePage"),
);
const employeeEditPage = lazy(
  () => import("@/modules/employee/pages/EmployeeEditPage"),
);

// Recruitment — ALL routes lazy-loaded correctly
const jobsPage = lazy(() => import("@/modules/recruitment/pages/JobsPage"));

//Candidate
const candidatesPage = lazy(
  () => import("@/modules/recruitment/pages/CandidatesPage"),
);
const candidateCreatePage = lazy(
  () => import("@/modules/recruitment/pages/candidate/CandidateCreatePage"),
);
const candidateDetailPage = lazy(
  () => import("@/modules/recruitment/pages/candidate/CandidateDetailsPage"),
);
const candidateEditPage = lazy(
  () => import("@/modules/recruitment/pages/candidate/CandidateEditPage"),
);

const pipelinePage = lazy(
  () => import("@/modules/recruitment/pages/PipelinePage"),
);
const interviewsPage = lazy(
  () => import("@/modules/recruitment/pages/InterviewsPage"),
);
const offersPage = lazy(() => import("@/modules/recruitment/pages/OffersPage"));
const attendancePage = lazy(() => import("@/modules/attendance/pages/AttendancePage"));
const companyListPage = lazy(
  () => import("@/modules/company/pages/CompanyListPage"),
);
const companyDetailPage = lazy(
  () => import("@/modules/company/pages/CompanyDetailPage"),
);

// ── Suspense wrapper ──────────────────────────────────────────────
const pageLoader = () => (
  <div className="grid h-full min-h-[60vh] place-items-center">
    <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const lazy_ = (el: React.ReactNode) => (
  <Suspense fallback={React.createElement(pageLoader)}>{el}</Suspense>
);

// ── Router ────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  // Public
  {
    element: <UnauthenticatedRoute />,
    children: [{ element: <AuthLayout />, children: [{ path: "/login", element: lazy_(React.createElement(loginPage)) }] }],
  },

  // Protected
  {
    element: <AuthenticatedRoute />,
    children: [{
      element: <DashboardLayout />,
      children: [
      { index: true, element: <Navigate to="/recruitment/jobs" replace /> },

      // Employee
      { path: "/employees/list/", element: lazy_(React.createElement(employeeListPage)) },
      { path: "/employees/list/new", element: lazy_(React.createElement(employeeCreatePage)) },
      { path: "/employees/list/:id/edit", element: lazy_(React.createElement(employeeEditPage)) },

      // Recruitment — 5 routes, all correctly lazy-loaded
      { path: "/recruitment/jobs", element: lazy_(React.createElement(jobsPage)) },
      {
        path: "/recruitment/candidates",
        element: <Outlet />,
        children: [
          { index: true, element: lazy_(React.createElement(candidatesPage)) },
          { path: "new", element: lazy_(React.createElement(candidateCreatePage)) },
          { path: ":id", element: lazy_(React.createElement(candidateDetailPage)) },
          { path: ":id/edit", element: lazy_(React.createElement(candidateEditPage)) },
        ],
      },
      { path: "/recruitment/pipeline", element: lazy_(React.createElement(pipelinePage)) },

      //Interview
      {
        path: "/recruitment/interviews",
        element: <Outlet />,
        children: [
          { index: true, element: lazy_(React.createElement(interviewsPage)) },
          //{ path: "schedule", element: lazy_(<ScheduleInterviewPage />) },
          //{path: ":id", element: <div className="card p-6">Schedule Detail page — coming soon</div>},
          //{path: ":id/", element: <div className="card p-6">Edit Schduled Interview page — coming soon</div>},
        ],
      },

      { path: "/recruitment/offers", element: lazy_(React.createElement(offersPage)) },

      // Company
      { path: "/hr/companies", element: lazy_(React.createElement(companyListPage)) },
      { path: "/hr/companies/:id", element: lazy_(React.createElement(companyDetailPage)) },

      // Module stubs — replace as you build them
      {
        path: "/dashboard",
        element: <div className="card p-6">Dashboard — coming soon</div>,
      },
      {
        path: "/attendance",
        element: lazy_(React.createElement(attendancePage)),
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
    }],
  },

  // Fallback
  { path: "*", element: <Navigate to="/recruitment/jobs" replace /> },
]);
