import type { CreateTask, EditTask, Task } from "@/features/tasks/schema";
import type { ApiError } from "@/lib/api/common/schema";
import { delayResponse } from "@/mocks/base";
import { tasksDb } from "@/mocks/db";
import { type HttpResponseResolver, type PathParams } from "msw";

export const getTasks: HttpResponseResolver = async () => {
  return delayResponse(Object.values(tasksDb.getValue()));
};

export const createTask: HttpResponseResolver<PathParams, CreateTask> = async ({
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
      parameters: [],
      ...newTask,
    });
    return _tasks;
  });

  return delayResponse(null, { status: 201 });
};

export const getTaskById: HttpResponseResolver<
  { taskId: string },
  Task
> = async ({ params }) => {
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

export const updateTask: HttpResponseResolver<
  { taskId: string },
  EditTask
> = async ({ params, request }) => {
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

export const deleteTaskById: HttpResponseResolver<{ taskId: string }> = async ({
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
