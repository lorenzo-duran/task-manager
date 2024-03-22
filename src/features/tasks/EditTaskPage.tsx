import { useEditTaskMutation, useGetTaskQuery } from "@/api/tasksApi";
import { LoaderFull } from "@/components/LoaderFull";
import type { EditTask } from "@/features/tasks/schema";
import { BackwardOutlined, CloseOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Select,
  Space,
  Typography,
} from "antd";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";

export type EditTaskFormValues = Omit<EditTask, "parameters" | "updateDate"> & {
  parameters: { key: string; value: string }[];
  updateDate: Dayjs;
};

export const EditTaskPage = () => {
  const [form] = Form.useForm<EditTaskFormValues>();
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const getTaskQuery = useGetTaskQuery(+taskId!, {
    skip: !taskId,
  });
  const [editTask, editTaskMutation] = useEditTaskMutation();

  useEffect(() => {
    if (!getTaskQuery.data) return;

    const parameters: { key: string; value: string }[] = [];
    for (const key in getTaskQuery.data.parameters) {
      parameters.push({ key: key, value: getTaskQuery.data.parameters[key] });
    }

    form.setFieldsValue({
      ...getTaskQuery.data!,
      parameters,
      updateDate: dayjs(getTaskQuery.data.updateDate),
    });
  }, [form, getTaskQuery.data]);

  const handleSubmit = async () => {
    if (!taskId) return;
    const values = await form.validateFields();

    const parameters: Record<string, string> = {};
    for (const item of values.parameters) {
      parameters[item.key] = item.value;
    }

    await editTask({
      taskId: +taskId,
      editTask: { ...values, parameters },
    }).unwrap();

    navigate("/tasks");
  };

  if (getTaskQuery.isLoading) return <LoaderFull />;

  return (
    <Flex className="m-6 flex-col max-w-screen-xl">
      <Flex className="flex-row justify-between items-center">
        <Flex className="flex-col justify-start items-start">
          <Link to="/tasks">
            <Button type="link" className="px-0" icon={<BackwardOutlined />}>
              Back To Tasks
            </Button>
          </Link>

          <Typography.Title className="my-2" level={4}>
            Edit Task
          </Typography.Title>
        </Flex>

        <Button
          loading={editTaskMutation.isLoading}
          className="w-fit"
          htmlType="submit"
          form="editTask"
          type="primary"
        >
          Save
        </Button>
      </Flex>
      <div className="p-4 rounded bg-white">
        <Form
          id="editTask"
          form={form}
          layout="inline"
          onFinish={handleSubmit}
          style={{
            rowGap: "0.5rem",
          }}
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
              <Select.Option value="set-status">Set Status</Select.Option>
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
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Update Date" name="updateDate">
            <DatePicker disabled />
          </Form.Item>

          <Flex className="basis-full flex-col">
            <Typography.Title level={4}>Parameters</Typography.Title>
          </Flex>

          <Form.Item name="parameters">
            <Form.List name="parameters">
              {(fields, { add, remove }) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 16,
                  }}
                >
                  {fields.map((field) => (
                    <Space key={field.key}>
                      <Form.Item noStyle name={[field.name, "key"]}>
                        <Input placeholder="first" />
                      </Form.Item>
                      <Form.Item noStyle name={[field.name, "value"]}>
                        <Input placeholder="second" />
                      </Form.Item>
                      <CloseOutlined
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} block>
                    + Add Sub Item
                  </Button>
                </div>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </div>
    </Flex>
  );
};
