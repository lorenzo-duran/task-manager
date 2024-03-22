import type {
  CheckAuthenticate,
  RequestLogin,
  SecurityCredentials,
} from "@/features/auth/schema";
import type {
  CreateProject,
  Project,
  ProjectResponse,
  ReorderProjects,
  RunProjects,
} from "@/features/projects/schema";
import type { CreateTask, EditTask, Task } from "@/features/tasks/schema";
import type {
  CheckUserEmailResponse,
  CreateUser,
  EditUser,
  User,
} from "@/features/user/schema";
import type { ApiError } from "@/lib/api/common/schema";
import { LiveStorage } from "@mswjs/storage";
import {
  HttpResponse,
  delay,
  http,
  type DefaultBodyType,
  type HttpResponseInit,
  type HttpResponseResolver,
  type JsonBodyType,
  type PathParams,
} from "msw";

const delayDuration = 1000;

const usersDb = new LiveStorage<User[]>("users", [
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

const tasksDb = new LiveStorage<Task[]>("tasks", [
  {
    id: 1,
    name: "A Task",
    type: "create",
    parameters: {
      key: "value",
    },
    updateDate: new Date().toISOString(),
    description: "A task is created",
  },
]);

const projectsDb = new LiveStorage<Project[]>("projects", [
  {
    id: 1,
    order: 1,
    result: null,
    taskId: 1,
  },
]);

usersDb.update((users) => users);
tasksDb.update((tasks) => tasks);
projectsDb.update((projects) => projects);

const delayResponse = async <TBody extends JsonBodyType>(
  body?: TBody | null,
  init?: HttpResponseInit
) => {
  await delay(delayDuration);
  return HttpResponse.json<TBody>(body, init);
};

const getUsers: HttpResponseResolver<
  PathParams,
  DefaultBodyType,
  DefaultBodyType
> = async () => {
  return delayResponse(Object.values(usersDb.getValue()));
};

const checkUserEmail: HttpResponseResolver<{ email: string }> = async ({
  params,
}) => {
  const emailDuplicated = !!usersDb
    .getValue()
    .find((user) => user.email === params.email);

  return delayResponse<CheckUserEmailResponse>({
    emailDuplicated,
  });
};

const getUserById: HttpResponseResolver<{ userId: string }, User> = async ({
  params,
}) => {
  const { userId } = params;
  const user = usersDb.getValue().find((user) => user.id === +userId);

  if (!user) {
    return delayResponse<ApiError>(
      {
        message: "User Not Found",
        type: "NOT_FOUND",
      },
      { status: 404 }
    );
  }

  return delayResponse(user);
};

const updateUserById: HttpResponseResolver<
  { userId: string },
  EditUser
> = async ({ params, request }) => {
  const { userId } = params;
  const editUserReq = await request.json();
  const userIndex = usersDb.getValue().findIndex((user) => user.id === +userId);

  if (userIndex === -1) {
    return delayResponse<ApiError>(
      {
        message: "User Not Found",
        type: "NOT_FOUND",
      },
      { status: 404 }
    );
  }

  const emailDuplicated = !!usersDb
    .getValue()
    .find((user) => user.email === editUserReq.email && user.id !== +userId);

  if (emailDuplicated) {
    return delayResponse<ApiError>(
      {
        message: "Email Duplicated",
        type: "DUPLICATED_EMAIL",
      },
      { status: 409 }
    );
  }

  usersDb.update((_users) => {
    _users[userIndex] = {
      ..._users[userIndex],
      ...editUserReq,
    };

    return _users;
  });

  return delayResponse(null, { status: 200 });
};

const deleteUserById: HttpResponseResolver<{ userId: string }> = async ({
  params,
}) => {
  const { userId } = params;
  const user = usersDb.getValue().find((user) => user.id === +userId);

  if (!user) {
    return delayResponse<ApiError>(
      {
        message: "User Not Found",
        type: "NOT_FOUND",
      },
      { status: 404 }
    );
  }

  usersDb.update((_users) => {
    return _users.filter((user) => user.id !== +userId);
  });

  return delayResponse(null, { status: 200 });
};

const createUser: HttpResponseResolver<PathParams, CreateUser> = async ({
  request,
}) => {
  const newUser = await request.json();

  const maxId = usersDb
    .getValue()
    .reduce((previousValue, currentValue) =>
      previousValue.id > currentValue.id ? previousValue : currentValue
    ).id;

  const emailDuplicated = !!usersDb
    .getValue()
    .find((user) => user.email === newUser.email);

  if (emailDuplicated) {
    return delayResponse<ApiError>(
      {
        message: "Email Duplicated",
        type: "DUPLICATED_EMAIL",
      },
      { status: 409 }
    );
  }

  usersDb.update((_users) => {
    _users.push({
      id: maxId + 1,
      ...newUser,
    });
    return _users;
  });

  return delayResponse(null, { status: 201 });
};

const checkAuthenticated: HttpResponseResolver = async ({ request }) => {
  const token = request.headers.get("Authentication");
  console.log("token", token);

  const user = usersDb.getValue().find((e) => e.email === token);

  if (user) {
    return delayResponse<CheckAuthenticate>({
      isAuthenticated: true,
      authorizations: user.roles,
      user,
    });
  }

  return delayResponse<CheckAuthenticate>({
    isAuthenticated: false,
  });
};

const login: HttpResponseResolver<PathParams, RequestLogin> = async ({
  request,
}) => {
  const data = await request.json();
  const user = usersDb.getValue().find((e) => e.email === data.email);

  if (!user) {
    return delayResponse<ApiError>(
      {
        message: "wrong credentials",
        type: "WRONG_CREDENTIALS",
      },
      { status: 401 }
    );
  }

  return delayResponse<SecurityCredentials>({
    token: data.email,
  });
};

const getTasks: HttpResponseResolver = async () => {
  await delay(delayDuration);
  return delayResponse(Object.values(tasksDb.getValue()));
};

const createTask: HttpResponseResolver<PathParams, CreateTask> = async ({
  request,
}) => {
  const newTask = await request.json();

  tasksDb.update((_tasks) => {
    const maxId = _tasks.reduce(
      (prev, current) => (prev.id > current.id ? prev : current),
      { id: 0 }
    ).id;

    _tasks.push({
      id: maxId + 1,
      updateDate: new Date().toDateString(),
      parameters: {},
      ...newTask,
    });
    return _tasks;
  });

  return delayResponse(null, { status: 201 });
};

const getTaskById: HttpResponseResolver<{ taskId: string }, Task> = async ({
  params,
}) => {
  const { taskId } = params;
  const task = tasksDb.getValue().find((task) => task.id === +taskId);

  if (!task) {
    return delayResponse<ApiError>(
      {
        message: "Task Not Found",
        type: "NOT_FOUND",
      },
      { status: 404 }
    );
  }

  return delayResponse(task);
};

const updateTask: HttpResponseResolver<{ taskId: string }, EditTask> = async ({
  params,
  request,
}) => {
  const { taskId } = params;
  const editTaskReq = await request.json();
  const taskIndex = tasksDb.getValue().findIndex((task) => task.id === +taskId);

  if (taskIndex === -1) {
    return delayResponse<ApiError>(
      {
        message: "Task Not Found",
        type: "NOT_FOUND",
      },
      { status: 404 }
    );
  }

  tasksDb.update((_tasks) => {
    _tasks[taskIndex] = {
      ..._tasks[taskIndex],
      ...editTaskReq,
      updateDate: new Date().toISOString(),
    };
    return _tasks;
  });

  return delayResponse(null, { status: 200 });
};

const deleteTaskById: HttpResponseResolver<{ taskId: string }> = async ({
  params,
}) => {
  const { taskId } = params;
  const taskIndex = tasksDb.getValue().findIndex((task) => task.id === +taskId);

  if (taskIndex === -1) {
    return delayResponse<ApiError>(
      {
        message: "Task Not Found",
        type: "NOT_FOUND",
      },
      { status: 404 }
    );
  }

  tasksDb.update((_tasks) => {
    _tasks.splice(taskIndex, 1);
    return _tasks;
  });

  return delayResponse(null, { status: 200 });
};

const getProjects: HttpResponseResolver<
  PathParams,
  DefaultBodyType,
  ProjectResponse[]
> = async () => {
  await delay(delayDuration);

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

const createProject: HttpResponseResolver<PathParams, CreateProject> = async ({
  request,
}) => {
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

const deleteProject: HttpResponseResolver<{ projectId: string }> = async ({
  params,
}) => {
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

const reorderProjects: HttpResponseResolver<
  PathParams,
  ReorderProjects
> = async ({ request }) => {
  const reorderData = await request.json();
  const { moveDirection, projectId } = reorderData;

  console.log("reorderData", reorderData);

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
  const projectIndex = projects.findIndex(
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

  const allProjects = projects.slice();
  allProjects.sort((a, b) => {
    return a.order - b.order;
  });

  const currentProject = allProjects[projectIndex];
  let newOrder = currentProject.order;

  console.log("allProjects", allProjects);
  console.log("projectIndex", projectIndex);
  console.log("newOrder", newOrder);
  console.log("currentProject", currentProject);

  if (moveDirection === "up" && projectIndex > 0) {
    // Swap order with project above
    const projectAbove = allProjects[projectIndex - 1];

    console.log("projectAbove", projectAbove);

    newOrder = projectAbove.order;
    allProjects[projectIndex - 1].order = currentProject.order;
    allProjects[projectIndex].order = newOrder;
  } else if (moveDirection === "down" && projectIndex < projects.length - 1) {
    // Swap order with project below
    const projectBelow = allProjects[projectIndex + 1];

    console.log("projectBelow", projectBelow);

    newOrder = projectBelow.order;
    allProjects[projectIndex + 1].order = currentProject.order;
    allProjects[projectIndex].order = newOrder;
  }

  projectsDb.update(() => {
    return allProjects;
  });

  return delayResponse(null, { status: 200 });
};

const runProjects: HttpResponseResolver<PathParams, RunProjects> = async ({
  request,
}) => {
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

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
