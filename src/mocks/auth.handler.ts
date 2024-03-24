import type {
  CheckAuthenticate,
  RequestLogin,
  SecurityCredentials,
} from "@/features/auth/schema";
import type { ApiError } from "@/lib/api/common/schema";
import { delayResponse } from "@/mocks/base";
import { usersDb } from "@/mocks/db";
import { type HttpResponseResolver, type PathParams } from "msw";

export const checkAuthenticated: HttpResponseResolver = async ({ request }) => {
  const token = request.headers.get("Authentication");

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

export const login: HttpResponseResolver<PathParams, RequestLogin> = async ({
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
