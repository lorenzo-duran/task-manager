import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import type { PropsWithChildren } from "react";
import { DashboardNavBar } from "./DashboardNavBar";
import { DashboardSideBar } from "./DashboardSideBar";

export const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Layout>
      <DashboardSideBar />
      <Layout>
        <DashboardNavBar />
        <Content className="flex flex-1 flex-col">{children}</Content>
      </Layout>
    </Layout>
  );
};
