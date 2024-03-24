import type { CreateTask, EditTask, Task } from "@/features/tasks/schema";
import { api } from ".";

export const tasksApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<Task[], void>({
      query: () => `tasks`,
      providesTags: [{ type: "Task", id: "PARTIAL-LIST" }],
    }),
    getTask: build.query<Task, number>({
      query: (id) => `tasks/${id}`,
      providesTags: (_, __, id) => [{ type: "Task", id }],
    }),
    editTask: build.mutation<void, { taskId: number; editTask: EditTask }>({
      query: ({ taskId, editTask }) => ({
        url: `tasks/${taskId}`,
        method: "PUT",
        body: editTask,
      }),
      invalidatesTags: (_, __, { taskId }) => [
        { type: "Task", id: "PARTIAL-LIST" },
        { type: "Task", id: taskId },
      ],
    }),
    deleteTask: build.mutation<void, number>({
      query: (taskId) => ({
        url: `tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Task", id: "PARTIAL-LIST" },
        { type: "Task", id },
      ],
    }),
    createTask: build.mutation<void, CreateTask>({
      query: (createTask) => ({
        url: `tasks`,
        method: "POST",
        body: createTask,
      }),
      invalidatesTags: [{ type: "Task", id: "PARTIAL-LIST" }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useLazyGetTaskQuery,
  useEditTaskMutation,
  useDeleteTaskMutation,
  useCreateTaskMutation,
} = tasksApi;
