import { UserAddOutlined } from "@ant-design/icons";
import { Button, Flex, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "active" | "inactive";
  roles: string[];
}

const dummyUsers: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com",
    status: "active",
    roles: ["View_Tasks", "Edit_Tasks"],
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "john@doe.com",
    status: "active",
    roles: ["View_Tasks"],
  },
  {
    id: "3",
    firstName: "Alice",
    lastName: "Johnson",
    email: "john@doe.com",
    status: "inactive",
    roles: ["Edit_Tasks", "Delete_Tasks"],
  },
  {
    id: "4",
    firstName: "Alice",
    lastName: "Johnson",
    email: "john@doe.com",
    status: "inactive",
    roles: ["Edit_Tasks", "Delete_Tasks"],
  },
];

export const Users: React.FC = () => {
  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,
      fixed: "left",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      width: 120,
      fixed: "left",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      width: 120,
      fixed: "left",
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (roles: string[]) => (
        <Space>
          <Typography.Text>{roles.join(", ")}</Typography.Text>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      fixed: "left",
    },
    {
      title: "Status",
      dataIndex: "status",
      fixed: "left",
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: () => (
        <Space>
          <Typography.Link>Edit</Typography.Link>
          <Typography.Link>Delete</Typography.Link>
        </Space>
      ),
    },
  ];

  return (
    <Flex className="p-4 flex-col">
      <Flex className="flex-row justify-between items-center">
        <Typography.Title level={2}>Users</Typography.Title>
        <Button type="primary" icon={<UserAddOutlined />}>
          Add
        </Button>
      </Flex>

      <Table
        bordered
        columns={columns}
        dataSource={dummyUsers}
        pagination={{ pageSize: 10 }} // Adjust pagination settings as needed
      />
    </Flex>
  );
};
