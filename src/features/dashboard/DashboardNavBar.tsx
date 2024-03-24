import { authApi } from "@/api/authApi";
import { useGetUsersQuery } from "@/api/usersApi";
import { changeLoggedInUser, logout } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/stores/base";
import { Button, Select, Space } from "antd";
import { Header } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";

export const DASHBOARD_NAV_BAR_HEIGHT = `calc(3rem + env(safe-area-inset-top))`;

export const DashboardNavBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const getUsersQuery = useGetUsersQuery();
  const token = useAppSelector((s) => s.auth.token);

  return (
    <Header
      style={{
        height: DASHBOARD_NAV_BAR_HEIGHT,
      }}
      className="flex flex-row items-center justify-end bg-white drop-shadow-sm"
    >
      <Space>
        <Button
          onClick={() => {
            dispatch(logout());
            dispatch(authApi.util.resetApiState());
            navigate("/login");
          }}
          type="text"
        >
          Logout
        </Button>

        <Select
          loading={getUsersQuery.isLoading}
          options={getUsersQuery.data?.map((u) => ({
            label: u.email,
            value: u.email,
          }))}
          defaultValue={token}
          onSelect={(email) => {
            dispatch(
              changeLoggedInUser({
                email,
              })
            );
            window.location.reload();
          }}
        />
      </Space>
    </Header>
  );
};
