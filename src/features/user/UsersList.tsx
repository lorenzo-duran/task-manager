import { useCheckAuthenticatedQuery } from "@/api/authApi";
import { useGetUsersQuery } from "@/api/usersApi";
import { useModalControl } from "@/components/Modal";
import { useCheckActionPermission } from "@/features/auth/auth.helpers";
import {
  DashboardPageContentLayout,
  DashboardPageLayout,
} from "@/features/dashboard/DashboardContentLayout";
import { CreateUserFormModal } from "@/features/user/CreateUserForm";
import { DeleteUserModal } from "@/features/user/DeleteUserModal";
import { EditUserFormModal } from "@/features/user/EditUserForm";
import type { User } from "@/features/user/schema";
import { UserAddOutlined } from "@ant-design/icons";
import { Button, Flex, Space, Table, Tag, Typography } from "antd";
import Column from "antd/es/table/Column";
import { twJoin } from "tailwind-merge";

export const UsersList: React.FC = () => {
  const getUsers = useGetUsersQuery();
  const checkAuthenticated = useCheckAuthenticatedQuery();

  const hasDeletePermission = useCheckActionPermission("DELETE_USERS");
  const hasEditPermission = useCheckActionPermission("EDIT_USERS");

  const editUserModalControl = useModalControl<{ userId: number }>();
  const createUserModalControl = useModalControl();
  const deleteUserModalControl = useModalControl<{ userId: number }>();

  return (
    <>
      <DashboardPageLayout>
        <Flex className="flex-row justify-between items-center">
          <Typography.Title level={2}>Users</Typography.Title>
          <Button
            onClick={createUserModalControl.open}
            type="primary"
            disabled={!hasEditPermission}
            icon={<UserAddOutlined />}
          >
            Add
          </Button>
        </Flex>

        <DashboardPageContentLayout>
          <Table
            bordered
            rowClassName={(record) =>
              twJoin(
                record.roles.includes("SUPER") &&
                  "bg-gray-100 cursor-not-allowed "
              )
            }
            dataSource={getUsers.data}
            rowKey="id"
            loading={getUsers.isLoading}
            pagination={false}
          >
            <Column<User>
              title="ID"
              dataIndex="id"
              render={(id: number) => (
                <Space>
                  <Typography.Text>{id}</Typography.Text>
                  {checkAuthenticated.data?.isAuthenticated &&
                    checkAuthenticated.data.user?.id === id && (
                      <Tag color="cyan">you</Tag>
                    )}
                </Space>
              )}
            />
            <Column<User> title="First Name" dataIndex="firstName" />
            <Column<User> title="Last Name" dataIndex="lastName" />
            <Column<User>
              title="Roles"
              dataIndex="roles"
              render={(roles: string[]) => (
                <Space>
                  <Typography.Text>{roles.join(", ")}</Typography.Text>
                </Space>
              )}
            />
            <Column<User> title="Email" dataIndex="email" />
            <Column<User> title="Status" dataIndex="status" />
            <Column<User>
              title="Actions"
              dataIndex="actions"
              width={120}
              render={(_, user) => (
                <Space>
                  <Typography.Link
                    onClick={() => {
                      editUserModalControl.open({
                        userId: user.id,
                      });
                    }}
                    disabled={
                      !hasDeletePermission || user.roles.includes("SUPER")
                    }
                  >
                    Edit
                  </Typography.Link>
                  <Typography.Link
                    onClick={() => {
                      deleteUserModalControl.open({
                        userId: user.id,
                      });
                    }}
                    disabled={
                      !hasEditPermission || user.roles.includes("SUPER")
                    }
                  >
                    Delete
                  </Typography.Link>
                </Space>
              )}
            />
          </Table>
        </DashboardPageContentLayout>
      </DashboardPageLayout>

      <EditUserFormModal
        open={editUserModalControl.isOpen}
        closeModal={editUserModalControl.close}
        userId={editUserModalControl.args?.userId}
      />
      <CreateUserFormModal
        open={createUserModalControl.isOpen}
        closeModal={createUserModalControl.close}
      />
      <DeleteUserModal
        open={deleteUserModalControl.isOpen}
        onCloseModal={deleteUserModalControl.close}
        userId={deleteUserModalControl.args?.userId}
      />
    </>
  );
};
