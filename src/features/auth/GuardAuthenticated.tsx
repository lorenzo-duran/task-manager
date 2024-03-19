import { useEffect, type PropsWithChildren } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorPage } from "../../components/ErrorPage";
import { LoaderFull } from "../../components/LoaderFull";
import type { UserAuthorization } from "./schema";
import { useCheckAuthenticated } from "./useCheckAuthenticated";

type GuardAuthenticatedProps = {
  authorizations?: UserAuthorization[];
  loginPath: string;
};

export const GuardAuthenticated: React.FC<
  PropsWithChildren<GuardAuthenticatedProps>
> = ({ children, authorizations, loginPath }) => {
  const checkAuthenticated = useCheckAuthenticated();
  const { pathname } = useLocation();

  const navigate = useNavigate();

  // Redirect to login
  useEffect(() => {
    if (
      checkAuthenticated.isSuccess &&
      !checkAuthenticated.data.isAuthenticated
    ) {
      navigate(`${loginPath}?redirect=${pathname || "/"}`, {
        replace: true,
      });
    }
  }, [
    checkAuthenticated.isSuccess,
    checkAuthenticated.data.isAuthenticated,
    loginPath,
    navigate,
    pathname,
  ]);

  // If no requested authorizations, check the isAuthenticated
  if (!authorizations && checkAuthenticated.data?.isAuthenticated) {
    return <>{children}</>;
  }

  if (
    checkAuthenticated.data?.authorizations &&
    checkAuthenticated.data?.isAuthenticated
  ) {
    // Check if the account has some of the requested authorizations  or
    // it's a super admin
    return !authorizations ||
      checkAuthenticated.data.authorizations.includes("SUPER") ||
      authorizations.some((a) =>
        checkAuthenticated.data.authorizations?.includes(a)
      ) ? (
      <>{children}</>
    ) : (
      <ErrorPage authorization />
    );
  }

  if (checkAuthenticated.isError) {
    return <ErrorPage />;
  }

  return <LoaderFull />;
};
