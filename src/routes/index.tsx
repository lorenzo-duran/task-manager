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
import { DashboardBaseLayout } from "../features/dashboard/DashboardBaseLayout";
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
          <DashboardBaseLayout>
            <GuardAuthenticated
              loginPath="/login"
              authorizations={["VIEW_USERS"]}
            >
              <Users />
            </GuardAuthenticated>
          </DashboardBaseLayout>
        ),
      },
      {
        path: "projects",
        element: (
          <DashboardBaseLayout>
            <GuardAuthenticated
              loginPath="/login"
              authorizations={["VIEW_PROJECTS"]}
            >
              <Projects />
            </GuardAuthenticated>
          </DashboardBaseLayout>
        ),
      },
      {
        path: "tasks",
        element: (
          <DashboardBaseLayout>
            <GuardAuthenticated
              loginPath="/login"
              authorizations={["VIEW_TASKS"]}
            >
              <Tasks />
            </GuardAuthenticated>
          </DashboardBaseLayout>
        ),
      },
      {
        path: "tasks/:taskId/edit",
        element: (
          <DashboardBaseLayout>
            <GuardAuthenticated
              loginPath="/login"
              authorizations={["EDIT_TASKS"]}
            >
              <EditTask />
            </GuardAuthenticated>
          </DashboardBaseLayout>
        ),
      },
    ],
  },
]);

export function Router(): JSX.Element {
  return createElement(RouterProvider, { router });
}
