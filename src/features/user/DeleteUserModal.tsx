import { useDeleteUserMutation } from "@/api/usersApi";
import type { EditUser } from "@/features/user/schema";
import { Modal, Typography, type ModalProps } from "antd";

export type LoginFormValues = EditUser;

type EditUserFormProps = Omit<ModalProps, "onOk"> & {
  userId?: number;
  closeModal: () => void;
};

export const DeleteUserModal = ({
  userId,
  closeModal,
  ...rest
}: EditUserFormProps) => {
  const [deleteUser, deleteUserMutation] = useDeleteUserMutation();

  const handleSubmit = async () => {
    if (!userId) return;

    await deleteUser(userId).unwrap();
    closeModal();
  };

  return (
    <Modal
      title="Delete User"
      onOk={handleSubmit}
      confirmLoading={deleteUserMutation.isLoading}
      onCancel={closeModal}
      {...rest}
    >
      <Typography.Title level={4}>Are You Sure?</Typography.Title>
      <Typography.Text className="text-red-600">
        This actin will remove the user
      </Typography.Text>
    </Modal>
  );
};
