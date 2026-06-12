import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "@/modules/dashboard/pages/DashboardPage";
import EmployeePage from "@/modules/employee/pages/EmployeePage";
import DashboardLayout from "../layouts/dashboard/DashboardLayout";
export const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/employees",
        element: <EmployeePage />,
      },
    ],
  },
]);
