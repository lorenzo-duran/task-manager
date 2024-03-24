import { checkAuthenticated, login } from "@/mocks/auth.handler";
import {
  createProject,
  deleteProject,
  getProjects,
  reorderProjects,
  runProjects,
} from "@/mocks/projects.handler";
import {
  createTask,
  deleteTaskById,
  getTaskById,
  getTasks,
  updateTask,
} from "@/mocks/tasks.handler";
import {
  checkUserEmail,
  createUser,
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from "@/mocks/users.handler";
import { http } from "msw";

export const handlers = [
  http.get("/api/users", getUsers),
  http.post("/api/users/email-check/:email", checkUserEmail),
  http.get("/api/users/:userId", getUserById),
  http.put("/api/users/:userId", updateUserById),
  http.delete("/api/users/:userId", deleteUserById),
  http.post("/api/users", createUser),

  http.get("/api/auth/check-authenticated", checkAuthenticated),
  http.post("/api/auth/login", login),

  http.get("/api/tasks", getTasks),
  http.post("/api/tasks", createTask),
  http.get("/api/tasks/:taskId", getTaskById),
  http.put("/api/tasks/:taskId", updateTask),
  http.delete("/api/tasks/:taskId", deleteTaskById),

  http.get("/api/projects", getProjects),
  http.post("/api/projects", createProject),
  http.delete("/api/projects/:projectId", deleteProject),
  http.post("/api/projects/reorder", reorderProjects),
  http.post("/api/projects/run", runProjects),
];
