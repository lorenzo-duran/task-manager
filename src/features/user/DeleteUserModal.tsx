import { useDeleteUserMutation } from "@/api/usersApi";
import { Modal, Typography, type ModalProps } from "antd";

type EditUserFormProps = Omit<ModalProps, "onOk"> & {
  userId?: number;
  onCloseModal: () => void;
};

export const DeleteUserModal = ({
  userId,
  onCloseModal: closeModal,
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
