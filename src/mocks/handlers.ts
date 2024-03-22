import type {
  CheckAuthenticate,
  RequestLogin,
  SecurityCredentials,
} from "@/features/auth/schema";
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

const users = new LiveStorage<User[]>("users", [
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

const tasks = new LiveStorage<Task[]>("tasks", [
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

users.update((users) => users);
users.update((tasks) => tasks);

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
  return delayResponse(Object.values(users.getValue()));
};

const checkUserEmail: HttpResponseResolver<{ email: string }> = async ({
  params,
}) => {
  const emailDuplicated = !!users
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
  const user = users.getValue().find((user) => user.id === +userId);

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
  const userIndex = users.getValue().findIndex((user) => user.id === +userId);

  if (userIndex === -1) {
    return delayResponse<ApiError>(
      {
        message: "User Not Found",
        type: "NOT_FOUND",
      },
      { status: 404 }
    );
  }

  const emailDuplicated = !!users
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

  users.update((_users) => {
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
  const user = users.getValue().find((user) => user.id === +userId);

  if (!user) {
    return delayResponse<ApiError>(
      {
        message: "User Not Found",
        type: "NOT_FOUND",
      },
      { status: 404 }
    );
  }

  users.update((_users) => {
    return _users.filter((user) => user.id !== +userId);
  });

  return delayResponse(null, { status: 200 });
};

const createUser: HttpResponseResolver<PathParams, CreateUser> = async ({
  request,
}) => {
  const newUser = await request.json();

  const maxId = users
    .getValue()
    .reduce((previousValue, currentValue) =>
      previousValue.id > currentValue.id ? previousValue : currentValue
    ).id;

  const emailDuplicated = !!users
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

  users.update((_users) => {
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

  const user = users.getValue().find((e) => e.email === token);

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
  const user = users.getValue().find((e) => e.email === data.email);

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
  return delayResponse(Object.values(tasks.getValue()));
};

const createTask: HttpResponseResolver<PathParams, CreateTask> = async ({
  request,
}) => {
  const newTask = await request.json();

  tasks.update((_tasks) => {
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
  const task = tasks.getValue().find((task) => task.id === +taskId);

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
  const taskIndex = tasks.getValue().findIndex((task) => task.id === +taskId);

  if (taskIndex === -1) {
    return delayResponse<ApiError>(
      {
        message: "Task Not Found",
        type: "NOT_FOUND",
      },
      { status: 404 }
    );
  }

  tasks.update((_tasks) => {
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
  const taskIndex = tasks.getValue().findIndex((task) => task.id === +taskId);

  if (taskIndex === -1) {
    return delayResponse<ApiError>(
      {
        message: "Task Not Found",
        type: "NOT_FOUND",
      },
      { status: 404 }
    );
  }

  tasks.update((_tasks) => {
    _tasks.splice(taskIndex, 1);
    return _tasks;
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
];
