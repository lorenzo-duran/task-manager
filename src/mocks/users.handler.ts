import type {
  CheckUserEmailResponse,
  CreateUser,
  EditUser,
  User,
} from "@/features/user/schema";
import type { ApiError } from "@/lib/api/common/schema";
import { delayResponse } from "@/mocks/base";
import { usersDb } from "@/mocks/db";
import {
  type DefaultBodyType,
  type HttpResponseResolver,
  type PathParams,
} from "msw";

export const getUsers: HttpResponseResolver<
  PathParams,
  DefaultBodyType,
  DefaultBodyType
> = async () => {
  return delayResponse(Object.values(usersDb.getValue()));
};

export const checkUserEmail: HttpResponseResolver<{ email: string }> = async ({
  params,
}) => {
  const emailDuplicated = !!usersDb
    .getValue()
    .find((user) => user.email === params.email);

  return delayResponse<CheckUserEmailResponse>({
    emailDuplicated,
  });
};

export const getUserById: HttpResponseResolver<
  { userId: string },
  User
> = async ({ params }) => {
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

export const updateUserById: HttpResponseResolver<
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

export const deleteUserById: HttpResponseResolver<{ userId: string }> = async ({
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

export const createUser: HttpResponseResolver<PathParams, CreateUser> = async ({
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
