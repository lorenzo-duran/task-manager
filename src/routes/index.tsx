import { createElement } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { GuardAuthenticated } from "../features/auth/GuardAuthenticated";
import { GuardPublicOnly } from "../features/auth/GuardPublicOnly";
import { Users } from "./Users";
import { Login } from "./Login";
import { RootLayout } from "../layout/RootLayout";
import { ErrorPage } from "../components/ErrorPage";
import { DashboardLayout } from "../features/dashboard/DashboardLayout";
import { Projects } from "./Projects";
import { Tasks } from "./Tasks";
import { EditTask } from "@/routes/EditTask";

const router = createBrowserRouter([
  {
    path: "",
    errorElement: <ErrorPage />,
    element: <RootLayout />,
    children: [
      {
        path: "login",
        element: (
          <GuardPublicOnly>
            <Login />
          </GuardPublicOnly>
        ),
      },
    ],
  },
  {
    path: "",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/users" replace /> },
      {
        path: "users",
        element: (
          <DashboardLayout>
            <GuardAuthenticated
              loginPath="/login"
              authorizations={["VIEW_USERS"]}
            >
              <Users />
            </GuardAuthenticated>
          </DashboardLayout>
        ),
      },
      {
        path: "projects",
        element: (
          <DashboardLayout>
            <GuardAuthenticated
              loginPath="/login"
              authorizations={["VIEW_PROJECTS"]}
            >
              <Projects />
            </GuardAuthenticated>
          </DashboardLayout>
        ),
      },
      {
        path: "tasks",
        element: (
          <DashboardLayout>
            <GuardAuthenticated
              loginPath="/login"
              authorizations={["VIEW_TASKS"]}
            >
              <Tasks />
            </GuardAuthenticated>
          </DashboardLayout>
        ),
      },
      {
        path: "tasks/:taskId/edit",
        element: (
          <DashboardLayout>
            <GuardAuthenticated
              loginPath="/login"
              authorizations={["EDIT_TASKS"]}
            >
              <EditTask />
            </GuardAuthenticated>
          </DashboardLayout>
        ),
      },
    ],
  },
]);

export function Router(): JSX.Element {
  return createElement(RouterProvider, { router });
}
