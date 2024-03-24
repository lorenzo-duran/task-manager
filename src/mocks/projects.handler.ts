import type {
  CreateProject,
  ProjectResponse,
  ReorderProjects,
  RunProjects,
} from "@/features/projects/schema";
import type { ApiError } from "@/lib/api/common/schema";
import { delayResponse } from "@/mocks/base";
import { projectsDb, tasksDb } from "@/mocks/db";
import {
  type DefaultBodyType,
  type HttpResponseResolver,
  type PathParams,
} from "msw";

export const getProjects: HttpResponseResolver<
  PathParams,
  DefaultBodyType,
  ProjectResponse[]
> = async () => {
  const projectResponse = projectsDb.getValue().map((project) => {
    const task = tasksDb.getValue().find((task) => task.id === project.taskId);
    return {
      task,
      ...project,
    } as ProjectResponse;
  });

  projectResponse.sort((a, b) => {
    return a.order - b.order;
  });

  return delayResponse<ProjectResponse[]>(projectResponse);
};

export const createProject: HttpResponseResolver<
  PathParams,
  CreateProject
> = async ({ request }) => {
  const newProject = await request.json();

  projectsDb.update((_projects) => {
    const maxId = _projects.reduce(
      (prev, current) => (prev.id > current.id ? prev : current),
      { id: 0 }
    ).id;

    _projects.push({
      id: maxId + 1,
      order: _projects.length + 1,
      result: null,
      ...newProject,
    });
    return _projects;
  });

  return delayResponse(null, { status: 201 });
};

export const deleteProject: HttpResponseResolver<{
  projectId: string;
}> = async ({ params }) => {
  const { projectId } = params;
  const projectIndex = projectsDb
    .getValue()
    .findIndex((project) => project.id === +projectId);

  if (projectIndex === -1) {
    return delayResponse<ApiError>(
      {
        message: "Project Not Found",
        type: "NOT_FOUND",
      },
      { status: 404 }
    );
  }

  projectsDb.update((_projects) => {
    _projects.splice(projectIndex, 1);
    return _projects;
  });

  return delayResponse(null, { status: 200 });
};

export const reorderProjects: HttpResponseResolver<
  PathParams,
  ReorderProjects
> = async ({ request }) => {
  const reorderData = await request.json();
  const { moveDirection, projectId } = reorderData;

  if (!moveDirection || !projectId) {
    return delayResponse<ApiError>(
      {
        message: "Missing required data (moveDirection, projectId)",
        type: "INVALID_DATA",
      },
      { status: 400 }
    );
  }

  const projects = projectsDb.getValue();
  const allProjects = projects.slice();
  allProjects.sort((a, b) => {
    return a.order - b.order;
  });

  const projectIndex = allProjects.findIndex(
    (project) => project.id === projectId
  );

  if (projectIndex === -1) {
    return delayResponse<ApiError>(
      {
        message: "Project Not Found",
        type: "NOT_FOUND",
      },
      { status: 404 }
    );
  }

  const currentProject = allProjects[projectIndex];
  let newOrder = currentProject.order;

  if (moveDirection === "up" && projectIndex > 0) {
    // Swap order with project above
    const projectAbove = allProjects[projectIndex - 1];

    newOrder = projectAbove.order;
    allProjects[projectIndex - 1].order = currentProject.order;
    allProjects[projectIndex].order = newOrder;
  } else if (moveDirection === "down" && projectIndex < projects.length - 1) {
    // Swap order with project below
    const projectBelow = allProjects[projectIndex + 1];

    newOrder = projectBelow.order;
    allProjects[projectIndex + 1].order = currentProject.order;
    allProjects[projectIndex].order = newOrder;
  }

  projectsDb.update(() => {
    return allProjects;
  });

  return delayResponse(null, { status: 200 });
};

export const runProjects: HttpResponseResolver<
  PathParams,
  RunProjects
> = async ({ request }) => {
  const { taskIds } = await request.json();

  projectsDb.update((_projects) => {
    taskIds.forEach((taskId) => {
      const projectIndex = _projects.findIndex((p) => p.id === taskId);
      if (projectIndex !== -1) {
        _projects[projectIndex].result = getRandomArbitrary(0, 2000);
      }
    });

    return _projects;
  });

  return delayResponse(null, { status: 200 });
};

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
