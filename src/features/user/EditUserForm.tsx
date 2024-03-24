import {
  useCheckUserEmailMutation,
  useEditUserMutation,
  useGetUserQuery,
} from "@/api/usersApi";
import { LoaderFull } from "@/components/LoaderFull";
import { USER_AUTHORIZATIONS } from "@/features/auth/schema";
import type { EditUser } from "@/features/user/schema";
import { skipToken } from "@reduxjs/toolkit/query";
import { Form, Input, Modal, Radio, Select, type ModalProps } from "antd";
import { useEffect } from "react";

export type LoginFormValues = EditUser;

type EditUserFormProps = Omit<ModalProps, "onOk"> & {
  userId?: number;
  closeModal: () => void;
};

export const EditUserFormModal = ({
  userId,
  closeModal,
  ...rest
}: EditUserFormProps) => {
  const [form] = Form.useForm<LoginFormValues>();

  const getUserQuery = useGetUserQuery(userId ?? skipToken);
  const [editUser, editUserMutation] = useEditUserMutation();
  const [checkUserEmail] = useCheckUserEmailMutation();

  useEffect(() => {
    if (!getUserQuery.currentData) return;
    form.setFieldsValue(getUserQuery.currentData!);
  }, [form, getUserQuery.currentData]);

  const handleSubmit = async () => {
    if (!userId) return;
    const values = await form.validateFields();

    await editUser({
      userId,
      editUser: values,
    }).unwrap();

    closeModal();
  };

  if (getUserQuery.isLoading || getUserQuery.isFetching)
    return (
      <Modal title="Edit User" okText="Save" onCancel={closeModal} {...rest}>
        <LoaderFull />
      </Modal>
    );

  return (
    <Modal
      title="Edit User"
      onOk={handleSubmit}
      okText="Save"
      confirmLoading={editUserMutation.isLoading}
      onCancel={closeModal}
      {...rest}
    >
      <Form
        layout="vertical"
        variant="filled"
        name="editUser"
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
          validateDebounce={300}
          rules={[
            {
              required: true,
            },
            {
              pattern: /^\S+@\S+\.\S+$/,
              message: "You should enter a valid email address",
            },
            {
              validator: async (_, email) => {
                if (!email || email === getUserQuery.currentData?.email) {
                  return Promise.resolve();
                }
                const res = await checkUserEmail(email).unwrap();
                if (res.emailDuplicated) return Promise.reject();
              },
              message: "Email already in use",
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
