import {
  CheckCircleOutlined,
  ProjectOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Flex, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../../components/Logo";

const navItems = [
  {
    path: "/users",
    title: "Users",
    icon: <UserOutlined />,
  },
  {
    path: "/projects",
    title: "Projects",
    icon: <ProjectOutlined />,
  },
  {
    path: "/tasks",
    title: "Tasks",
    icon: <CheckCircleOutlined />,
  },
];

export const DashboardSideBar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const defaultSelectedKey = navItems.find((x) =>
    pathname.startsWith(x.path)
  )?.path;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <Flex className="justify-center items-center my-4">
        <Logo className="w-10 h-fit" />
      </Flex>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={defaultSelectedKey ? [defaultSelectedKey] : []}
        items={navItems.map((navItem) => ({
          key: navItem.path,
          icon: navItem.icon,
          label: <Link to={navItem.path}>{navItem.title}</Link>,
        }))}
      />
    </Sider>
  );
};
