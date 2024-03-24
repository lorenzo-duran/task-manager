import { useCheckAuthenticatedQuery } from "@/api/authApi";
import type { UserAuthorization } from "@/features/auth/schema";
import { useMemo } from "react";

export const useCheckActionPermission = (
  action: UserAuthorization
): boolean => {
  const checkAuthenticated = useCheckAuthenticatedQuery();

  const hasActionPermission = useMemo(() => {
    if (!checkAuthenticated.data?.isAuthenticated) return false;

    if (checkAuthenticated.data.authorizations?.includes("SUPER")) return true;
    if (checkAuthenticated.data.authorizations?.includes(action)) return true;

    return false;
  }, [action, checkAuthenticated]);

  return hasActionPermission;
};
