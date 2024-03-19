import { ReactNode, useEffect } from "react";
import { useCheckAuthenticated } from "./useCheckAuthenticated";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoaderFull } from "../../components/LoaderFull";
import { ErrorPage } from "../../components/ErrorPage";

export const GuardPublicOnly = ({ children }: { children: ReactNode }) => {
  const checkAuthenticated = useCheckAuthenticated();
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
