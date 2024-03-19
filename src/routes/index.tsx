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
          <GuardAuthenticated
            loginPath="/login"
            authorizations={["VIEW_USERS"]}
          >
            <DashboardLayout>
              <Users />
            </DashboardLayout>
          </GuardAuthenticated>
        ),
      },
      {
        path: "projects",
        element: (
          <GuardAuthenticated
            loginPath="/login"
            authorizations={["VIEW_PROJECTS"]}
          >
            <DashboardLayout>
              <Projects />
            </DashboardLayout>
          </GuardAuthenticated>
        ),
      },
      {
        path: "tasks",
        element: (
          <GuardAuthenticated
            loginPath="/login"
            authorizations={["VIEW_TASKS"]}
          >
            <DashboardLayout>
              <Tasks />
            </DashboardLayout>
          </GuardAuthenticated>
        ),
      },
    ],
  },
]);

export function Router(): JSX.Element {
  return createElement(RouterProvider, { router });
}
