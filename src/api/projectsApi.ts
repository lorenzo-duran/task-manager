import type {
  CreateProject,
  ProjectResponse,
  ReorderProjects,
  RunProjects,
} from "@/features/projects/schema";
import { api } from ".";

export const projectsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<ProjectResponse[], void>({
      query: () => `/projects`,
      providesTags: [{ type: "Project", id: "PARTIAL-LIST" }],
    }),
    deleteProject: build.mutation<void, number>({
      query: (projectId) => ({
        url: `/projects/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Project", id: "PARTIAL-LIST" },
        { type: "Project", id },
      ],
    }),
    createProject: build.mutation<void, CreateProject>({
      query: (createProject) => ({
        url: `/projects`,
        method: "POST",
        body: createProject,
      }),
      invalidatesTags: [{ type: "Project", id: "PARTIAL-LIST" }],
    }),
    runProjects: build.mutation<void, RunProjects>({
      query: (runProjects) => ({
        url: `/projects/run`,
        method: "POST",
        body: runProjects,
      }),
      invalidatesTags: [{ type: "Project", id: "PARTIAL-LIST" }],
    }),
    reorderProject: build.mutation<void, ReorderProjects>({
      query: (reorderProjects) => ({
        url: `/projects/reorder`,
        method: "POST",
        body: reorderProjects,
      }),
      invalidatesTags: [{ type: "Project", id: "PARTIAL-LIST" }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useRunProjectsMutation,
  useReorderProjectMutation,
} = projectsApi;
