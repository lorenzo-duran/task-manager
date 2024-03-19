import { useCheckAuthenticatedQuery } from "@/api/authApi";
import { ReactNode, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ErrorPage } from "../../components/ErrorPage";
import { LoaderFull } from "../../components/LoaderFull";

export const GuardPublicOnly = ({ children }: { children: ReactNode }) => {
  const checkAuthenticated = useCheckAuthenticatedQuery();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      checkAuthenticated.isSuccess &&
      checkAuthenticated.data.isAuthenticated
    ) {
      const redirect = searchParams?.get("redirect") || "/";
      navigate(redirect, {
        replace: true,
      });
    }
  }, [
    searchParams,
    navigate,
    checkAuthenticated.isSuccess,
    checkAuthenticated.data,
  ]);

  if (
    checkAuthenticated.isSuccess &&
    !checkAuthenticated.data.isAuthenticated
  ) {
    return <>{children}</>;
  }

  if (checkAuthenticated.isError) {
    return <ErrorPage />;
  }

  return <LoaderFull />;
};
