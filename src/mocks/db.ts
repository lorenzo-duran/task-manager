import type { Project } from "@/features/projects/schema";
import type { Task } from "@/features/tasks/schema";
import type { User } from "@/features/user/schema";
import { LiveStorage } from "@mswjs/storage";

export const usersDb = new LiveStorage<User[]>("users", [
  {
    id: 1,
    firstName: "Super",
    lastName: "Admin",
    email: "super@admin.com",
    status: "active",
    roles: ["SUPER"],
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@smith.com",
    status: "active",
    roles: ["DELETE_PROJECTS", "EDIT_PROJECTS", "VIEW_PROJECTS"],
  },
]);

export const tasksDb = new LiveStorage<Task[]>("tasks", [
  {
    id: 1,
    name: "Task (1)",
    type: "create",
    parameters: [
      {
        key: "hey",
        value: "hoy",
      },
    ],
    updateDate: new Date().toISOString(),
    description: "A task is created",
  },
  {
    id: 2,
    name: "Task (2)",
    type: "modify",
    parameters: [
      {
        key: "hey",
        value: "hoy",
      },
    ],
    updateDate: new Date().toISOString(),
    description: "this is not a task",
  },
  {
    id: 3,
    name: "Task (3)",
    type: "modify",
    parameters: [
      {
        key: "hey",
        value: "hoy",
      },
    ],
    updateDate: new Date().toISOString(),
    description: "Do landry",
  },
]);

export const projectsDb = new LiveStorage<Project[]>("projects", [
  {
    id: 1,
    order: 1,
    result: null,
    taskId: 1,
  },
  {
    id: 2,
    order: 2,
    result: null,
    taskId: 2,
  },
  {
    id: 3,
    order: 3,
    result: null,
    taskId: 3,
  },
]);

usersDb.update((users) => users);
tasksDb.update((tasks) => tasks);
projectsDb.update((projects) => projects);
