import { Outlet } from "react-router-dom";
import { Viewport } from "../components/Viewport";

export const RootLayout: React.FC = () => {
  return (
    <Viewport>
      <Outlet />
    </Viewport>
  );
};
