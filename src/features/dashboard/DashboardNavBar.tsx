import { Header } from "antd/es/layout/layout";

export const DASHBOARD_NAV_BAR_HEIGHT = `calc(3rem + env(safe-area-inset-top))`;

export const DashboardNavBar: React.FC = () => {
  return (
    <Header
      style={{
        height: DASHBOARD_NAV_BAR_HEIGHT,
      }}
      className="flex flex-row items-center bg-white drop-shadow-sm"
    />
  );
};
