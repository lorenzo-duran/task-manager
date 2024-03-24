export interface Task {
  id: number;
  name: string;
  description?: string;
  updateDate: string;
  type: "set-status" | "run" | "delete" | "create" | "modify";
  parameters: TaskParameter[];
}

export interface TaskParameter {
  key: string;
  value: string;
}

export type CreateTask = Omit<Task, "id" | "updateDate" | "parameters">;
export type EditTask = Omit<Task, "id" | "updateDate">;
