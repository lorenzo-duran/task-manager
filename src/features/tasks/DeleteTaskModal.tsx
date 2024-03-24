import { useDeleteTaskMutation } from "@/api/tasksApi";
import { Modal, Typography, type ModalProps } from "antd";

type EditTaskFormProps = Omit<ModalProps, "onOk"> & {
  taskId?: number;
  onCloseModal: () => void;
};

export const DeleteTaskModal = ({
  taskId,
  onCloseModal: closeModal,
  ...rest
}: EditTaskFormProps) => {
  const [deleteTask, deleteTaskMutation] = useDeleteTaskMutation();

  const handleSubmit = async () => {
    if (!taskId) return;

    await deleteTask(taskId).unwrap();
    closeModal();
  };

  return (
    <Modal
      title="Delete Task"
      onOk={handleSubmit}
      confirmLoading={deleteTaskMutation.isLoading}
      onCancel={closeModal}
      {...rest}
    >
      <Typography.Title level={4}>Are You Sure?</Typography.Title>
      <Typography.Text className="text-red-600">
        This actin will remove the task
      </Typography.Text>
    </Modal>
  );
};
