import { useCheckAuthenticatedQuery } from "@/api/authApi";
import { useGetUsersQuery } from "@/api/usersApi";
import {
  hasPermission,
  useCheckActionPermission,
} from "@/features/auth/auth.helpers";
import { CreateUserFormModal } from "@/features/user/CreateUserForm";
import { DeleteUserModal } from "@/features/user/DeleteUserModal";
import { EditUserFormModal } from "@/features/user/EditUserForm";
import type { User } from "@/features/user/schema";
import { UserAddOutlined } from "@ant-design/icons";
import { Button, Flex, Space, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd/es/table";
import { useCallback, useMemo, useState } from "react";

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

  const columns = useMemo(
    () =>
      [
        {
          title: "ID",
          dataIndex: "id",
          fixed: "left",
          key: "id",
          render: (id: number) => (
            <Space>
              <Typography.Text>{id}</Typography.Text>
              {checkAuthenticated.data?.isAuthenticated &&
                checkAuthenticated.data.user.id === id && (
                  <Tag color="cyan">you</Tag>
                )}
            </Space>
          ),
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
          render: (_, user) => (
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
          ),
        },
      ] as TableProps<User>["columns"],
    [
      checkAuthenticated,
      deleteButtonEnabled,
      editButtonEnabled,
      openDeleteUserModal,
      openEditUserModal,
    ]
  );

  return (
    <>
      <Flex className="p-4 flex-col">
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

        <Table
          bordered
          columns={columns}
          dataSource={getUsers.data}
          rowKey="id"
          loading={getUsers.isLoading}
          pagination={false}
        />
      </Flex>

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

const useModalControl = <T extends object>() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalArgs, setModalArgs] = useState<T | undefined>();

  const openModal = useCallback((args: T) => {
    setModalArgs({ ...args });
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalArgs(undefined);
    setIsModalOpen(false);
  }, []);

  return {
    modalArgs,
    isModalOpen,
    openModal,
    closeModal,
  };
};
