import { useCreateUserMutation } from "@/api/usersApi";
import { USER_AUTHORIZATIONS } from "@/features/auth/schema";
import type { CreateUser } from "@/features/user/schema";
import { Form, Input, Modal, Radio, Select, type ModalProps } from "antd";

export type LoginFormValues = CreateUser;

type CreateUserFormProps = Omit<ModalProps, "onOk"> & {
  closeModal: () => void;
};

export const CreateUserFormModal = ({
  closeModal,
  ...rest
}: CreateUserFormProps) => {
  const [form] = Form.useForm<LoginFormValues>();
  const [createUser, createUserMutation] = useCreateUserMutation();

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await createUser(values).unwrap();
    closeModal();
  };

  return (
    <Modal
      title="Add User"
      onOk={handleSubmit}
      okText="Submit"
      confirmLoading={createUserMutation.isLoading}
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
            {
              min: 3,
            },
          ]}
          label="First Name"
          name="firstName"
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              min: 3,
            },
          ]}
          label="Last Name"
          name="lastName"
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
            },
            {
              pattern: /^\S+@\S+\.\S+$/,
              message: "You should enter a valid email address",
            },
          ]}
          label="Email"
          name="email"
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          label="Status"
          name="status"
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="active">Active</Radio.Button>
            <Radio.Button value="inactive">Inactive</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          label="Roles"
          name="roles"
        >
          <Select
            mode="multiple"
            options={USER_AUTHORIZATIONS.map((a) => ({
              label: a,
              value: a,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
