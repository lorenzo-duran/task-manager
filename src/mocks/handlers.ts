import type {
  CheckAuthenticate,
  RequestLogin,
  SecurityCredentials,
} from "@/features/auth/schema";
import type {
  CheckUserEmailResponse,
  CreateUser,
  EditUser,
  User,
} from "@/features/user/schema";
import type { ApiError } from "@/lib/api/common/schema";
import { LiveStorage } from "@mswjs/storage";
import { HttpResponse, delay, http, type PathParams } from "msw";

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
  {
    id: 3,
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@johnson.com",
    status: "active",
    roles: ["DELETE_USERS", "EDIT_USERS", "VIEW_USERS"],
  },
  {
    id: 4,
    firstName: "James",
    lastName: "Johnson",
    email: "james@johnson.com",
    status: "active",
    roles: ["VIEW_PROJECTS", "VIEW_TASKS", "VIEW_USERS"],
  },
]);
users.update((users) => users);

export const handlers = [
  http.get("api/users", async () => {
    await delay(delayDuration);
    return HttpResponse.json(Object.values(users.getValue()));
  }),
  http.post<{ email: string }>(
    "api/users/email-check/:email",
    async ({ params }) => {
      await delay(delayDuration);

      const emailDuplicated = !!users
        .getValue()
        .find((user) => user.email === params.email);

      return HttpResponse.json<CheckUserEmailResponse>({
        emailDuplicated,
      });
    }
  ),
  http.get<{ userId: string }, User>(
    "api/users/:userId",
    async ({ params }) => {
      await delay(delayDuration);
      const { userId } = params;
      const user = users.getValue().find((user) => user.id === +userId);

      if (!user) {
        return HttpResponse.json<ApiError>(
          {
            message: "User Not Found",
            type: "NOT_FOUND",
          },
          { status: 404 }
        );
      }

      return HttpResponse.json(user);
    }
  ),
  http.put<{ userId: string }, EditUser>(
    "api/users/:userId",
    async ({ params, request }) => {
      await delay(delayDuration);

      const { userId } = params;
      const editUserReq = await request.json();
      const userIndex = users
        .getValue()
        .findIndex((user) => user.id === +userId);

      if (userIndex === -1) {
        return HttpResponse.json<ApiError>(
          {
            message: "User Not Found",
            type: "NOT_FOUND",
          },
          { status: 404 }
        );
      }

      const emailDuplicated = !!users
        .getValue()
        .find(
          (user) => user.email === editUserReq.email && user.id !== +userId
        );

      if (emailDuplicated) {
        return HttpResponse.json<ApiError>(
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

      return HttpResponse.json(null, { status: 200 });
    }
  ),
  http.delete<{ userId: string }>("api/users/:userId", async ({ params }) => {
    await delay(delayDuration);
    const { userId } = params;

    const user = users.getValue().find((user) => user.id === +userId);

    if (!user) {
      return HttpResponse.json<ApiError>(
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

    return HttpResponse.json(null, { status: 200 });
  }),
  http.post<PathParams, CreateUser>("api/users", async ({ request }) => {
    await delay(delayDuration);
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
      return HttpResponse.json<ApiError>(
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

    return HttpResponse.json(null, { status: 201 });
  }),

  http.get("api/auth/check-authenticated", async ({ request }) => {
    await delay(delayDuration);
    const token = request.headers.get("Authentication");
    const user = users.getValue().find((e) => e.email === token);

    if (user) {
      return HttpResponse.json<CheckAuthenticate>({
        isAuthenticated: true,
        authorizations: user.roles,
        user,
      });
    }

    return HttpResponse.json<CheckAuthenticate>({
      isAuthenticated: false,
    });
  }),

  http.post<PathParams, RequestLogin>("api/auth/login", async ({ request }) => {
    await delay(delayDuration);
    const data = await request.json();
    const user = users.getValue().find((e) => e.email === data.email);

    if (!user) {
      return HttpResponse.json<ApiError>(
        {
          message: "wrong credentials",
          type: "WRONG_CREDENTIALS",
        },
        { status: 401 }
      );
    }

    return HttpResponse.json<SecurityCredentials>({
      token: data.email,
    });
  }),
];
