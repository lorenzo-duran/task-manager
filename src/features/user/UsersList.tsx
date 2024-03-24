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

export const UsersList: React.FC = () => {
  const getUsers = useGetUsersQuery();
  const checkAuthenticated = useCheckAuthenticatedQuery();

  const deleteButtonEnabled = useCheckActionPermission("DELETE_USERS");
  const editButtonEnabled = useCheckActionPermission("EDIT_USERS");

  const {
    modalArgs: editUserArgs,
    isModalOpen: isEditUserModalOpen,
    openModal: openEditUserModal,
    closeModal: closeEditUserModal,
  } = useModalControl<{ userId: number }>();

  const {
    isModalOpen: isCreateUserModalOpen,
    openModal: openCreateUserModal,
    closeModal: closeCreateUserModal,
  } = useModalControl();

  const {
    isModalOpen: isDeleteUserModalOpen,
    openModal: openDeleteUserModal,
    closeModal: closeDeleteUserModal,
    modalArgs: deleteUserArgs,
  } = useModalControl<{ userId: number }>();

  return (
    <>
      <DashboardPageLayout>
        <Flex className="flex-row justify-between items-center">
          <Typography.Title level={2}>Users</Typography.Title>
          <Button
            onClick={openCreateUserModal}
            type="primary"
            icon={<UserAddOutlined />}
          >
            Add
          </Button>
        </Flex>

        <DashboardPageContentLayout>
          <Table
            bordered
            dataSource={getUsers.data}
            rowKey="id"
            loading={getUsers.isLoading}
            pagination={false}
          >
            <Column<User>
              title="ID"
              dataIndex="id"
              fixed="left"
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
            <Column<User>
              title="First Name"
              dataIndex="firstName"
              fixed="left"
            />
            <Column<User> title="Last Name" dataIndex="lastName" fixed="left" />
            <Column<User>
              title="Roles"
              dataIndex="roles"
              fixed="left"
              render={(roles: string[]) => (
                <Space>
                  <Typography.Text>{roles.join(", ")}</Typography.Text>
                </Space>
              )}
            />
            <Column<User> title="Email" dataIndex="email" fixed="left" />
            <Column<User> title="Status" dataIndex="status" fixed="left" />
            <Column<User>
              title="Actions"
              dataIndex="actions"
              width={120}
              render={(_, user) => (
                <Space>
                  <Typography.Link
                    onClick={() => {
                      openEditUserModal({
                        userId: user.id,
                      });
                    }}
                    disabled={!deleteButtonEnabled}
                  >
                    Edit
                  </Typography.Link>
                  <Typography.Link
                    onClick={() => {
                      openDeleteUserModal({
                        userId: user.id,
                      });
                    }}
                    disabled={!editButtonEnabled}
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
        open={isEditUserModalOpen}
        closeModal={closeEditUserModal}
        userId={editUserArgs?.userId}
      />
      <CreateUserFormModal
        open={isCreateUserModalOpen}
        closeModal={closeCreateUserModal}
      />
      <DeleteUserModal
        open={isDeleteUserModalOpen}
        closeModal={closeDeleteUserModal}
        userId={deleteUserArgs?.userId}
      />
    </>
  );
};
