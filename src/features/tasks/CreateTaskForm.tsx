import { useCreateTaskMutation } from "@/api/tasksApi";
import type { CreateTask } from "@/features/tasks/schema";
import { Form, Input, Modal, Select, type ModalProps } from "antd";

export type CreateTaskFormValues = CreateTask;

type CreateTaskFormModalProps = Omit<ModalProps, "onOk"> & {
  closeModal: () => void;
};

export const CreateTaskFormModal = ({
  closeModal,
  ...rest
}: CreateTaskFormModalProps) => {
  const [form] = Form.useForm<CreateTaskFormValues>();
  const [createTask, createTaskMutation] = useCreateTaskMutation();

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await createTask(values).unwrap();
    closeModal();
  };

  return (
    <Modal
      title="Create Task"
      onOk={handleSubmit}
      confirmLoading={createTaskMutation.isLoading}
      onCancel={closeModal}
      {...rest}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          rules={[
            {
              required: true,
            },
            {
              min: 3,
              message: "Task name must be at least 3 characters",
            },
          ]}
          label="Task Name"
          name="name"
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          label="Type"
          name="type"
        >
          <Select>
            <Select.Option value="set-status">Set-Status</Select.Option>
            <Select.Option value="run">Run</Select.Option>
            <Select.Option value="delete">Delete</Select.Option>
            <Select.Option value="create">Create</Select.Option>
            <Select.Option value="modify">Modify</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          label="Description"
          name="description"
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
