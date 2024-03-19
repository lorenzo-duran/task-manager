import { authApi } from "@/api/authApi";
import { logout } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/lib/stores/base";
import { Button } from "antd";
import { Header } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";

export const DASHBOARD_NAV_BAR_HEIGHT = `calc(3rem + env(safe-area-inset-top))`;

export const DashboardNavBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <Header
      style={{
        height: DASHBOARD_NAV_BAR_HEIGHT,
      }}
      className="flex flex-row items-center justify-end bg-white drop-shadow-sm"
    >
      <Button
        onClick={() => {
          dispatch(logout());
          dispatch(authApi.util.resetApiState());
          navigate("/login");
        }}
      >
        Logout
      </Button>
    </Header>
  );
};
