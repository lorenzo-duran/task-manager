import { useGetUsersQuery } from "@/api/usersApi";
import { UserAddOutlined } from "@ant-design/icons";
import { Button, Flex, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { User } from "@/features/user/schema";

export const UsersList: React.FC = () => {
  const getUsers = useGetUsersQuery();

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
        dataSource={getUsers.data}
        rowKey="id"
        loading={getUsers.isLoading}
        pagination={{ pageSize: 10 }} // Adjust pagination settings as needed
      />
    </Flex>
  );
};

const columns: ColumnsType<User> = [
  {
    title: "ID",
    dataIndex: "id",
    fixed: "left",
    key: "id",
  },
  {
    title: "First Name",
    dataIndex: "firstName",
    fixed: "left",
    key: "firstName",
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    fixed: "left",
    key: "lastName",
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
    key: "email",
    fixed: "left",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    fixed: "left",
  },
  {
    title: "Actions",
    key: "actions",
    width: 120,
    render: () => (
      <Space>
        <Typography.Link>Edit</Typography.Link>
        <Typography.Link>Delete</Typography.Link>
      </Space>
    ),
  },
];
