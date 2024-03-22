import { useCreateProjectMutation } from "@/api/projectApi";
import { useGetTasksQuery } from "@/api/tasksApi";
import type { CreateProject } from "@/features/projects/schema";
import { Form, Modal, Select, type ModalProps } from "antd";

export type CreateProjectFormValues = CreateProject;

type CreateProjectModalProps = Omit<ModalProps, "onOk"> & {
  closeModal: () => void;
};

export const CreateProjectModal = ({
  closeModal,
  ...rest
}: CreateProjectModalProps) => {
  const [form] = Form.useForm<CreateProjectFormValues>();
  const getTasksQuery = useGetTasksQuery();
  const [createProject, crateProjectMutation] = useCreateProjectMutation();

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await createProject(values).unwrap();
    closeModal();
    form.resetFields();
  };

  return (
    <Modal
      title="Create User"
      onOk={handleSubmit}
      confirmLoading={crateProjectMutation.isLoading}
      onCancel={closeModal}
      {...rest}
    >
      <Form
        layout="vertical"
        variant="filled"
        name="createUser"
        form={form}
        onFinish={handleSubmit}
      >
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          label="Task"
          name="taskId"
        >
          <Select
            loading={getTasksQuery.isLoading}
            options={getTasksQuery.data?.map((task) => ({
              label: task.name,
              value: task.id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
