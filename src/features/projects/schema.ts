import type { Task } from "@/features/tasks/schema";

export interface Project {
  id: number;
  taskId: number;
  order: number;
  result: number | null;
}

export interface ProjectResponse extends Project {
  task: Task | null;
}

export interface CreateProject {
  taskId: number;
}

export interface RunProjects {
  taskIds: number[];
  baseline: number;

  // type: Date
  cutOffDate: string;
  rateLimit: number;
}

export interface ReorderProjects {
  moveDirection: "up" | "down";
  projectId: number;
}
