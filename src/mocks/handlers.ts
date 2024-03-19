import type {
  CheckAuthenticate,
  RequestLogin,
  SecurityCredentials,
} from "@/features/auth/schema";
import type { User } from "@/features/user/schema";
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

  http.get("api/auth/check-authenticated", async ({ request }) => {
    await delay(delayDuration);
    const token = request.headers.get("Authentication");
    const user = users.getValue().find((e) => e.email === token);

    if (user) {
      return HttpResponse.json<CheckAuthenticate>({
        isAuthenticated: true,
        authorizations: user.roles,
      });
    }

    return HttpResponse.json<CheckAuthenticate>({
      isAuthenticated: false,
      authorizations: [],
    });
  }),

  http.post<PathParams, RequestLogin>("api/auth/login", async ({ request }) => {
    await delay(delayDuration);
    const data = await request.json();
    const user = users.getValue().find((e) => e.email === data.email);

    if (!user) {
      return HttpResponse.json<ApiError>(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return HttpResponse.json<SecurityCredentials>({
      token: data.email,
    });
  }),
];
