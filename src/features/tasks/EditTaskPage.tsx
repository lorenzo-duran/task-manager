import { useEditTaskMutation, useGetTaskQuery } from "@/api/tasksApi";
import { LoaderFull } from "@/components/LoaderFull";
import {
  DashboardPageContentLayout,
  DashboardPageLayout,
} from "@/features/dashboard/DashboardContentLayout";
import type { EditTask } from "@/features/tasks/schema";
import { BackwardOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  Select,
  Table,
  Typography,
  type FormListFieldData,
  type FormListOperation,
  type TableProps,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export type EditTaskFormValues = Omit<EditTask, "parameters" | "updateDate"> & {
  parameters: { key: string; value: string }[];
  updateDate: Dayjs;
};

type FormListRow = {
  field: FormListFieldData;
  operation: FormListOperation;
  meta: {
    errors: React.ReactNode[];
    warnings: React.ReactNode[];
  };
};

export const PageEditTask = () => {
  const [form] = Form.useForm<EditTaskFormValues>();
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const columns = useMemo(
    () =>
      [
        {
          title: "Task Name",
          width: "20%",
          render: () => (
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              name="name"
            >
              <Input />
            </Form.Item>
          ),
        },
        {
          title: "Description",
          width: "40%",
          render: () => (
            <Form.Item name="description">
              <Input.TextArea rows={2} />
            </Form.Item>
          ),
        },
        {
          title: "Type",
          width: "20%",
          render: () => (
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
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
          ),
        },
        {
          title: "Update Date",
          width: "20%",
          render: () => (
            <Form.Item name="updateDate">
              <DatePicker disabled />
            </Form.Item>
          ),
        },
      ] as TableProps["columns"],
    []
  );

  const columns2 = useMemo(
    () =>
      [
        {
          title: "Key",
          dataIndex: ["field", "key"],
          render: (_, record) => (
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              noStyle
              name={[record.field.name, "key"]}
            >
              <Input />
            </Form.Item>
          ),
        },
        {
          title: "Value",
          dataIndex: ["field", "value"],
          render: (_, record) => (
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              noStyle
              name={[record.field.name, "value"]}
            >
              <Input />
            </Form.Item>
          ),
        },
        {
          title: "Actions",
          render: (_, record, index) => (
            <Button
              icon={<DeleteOutlined />}
              onClick={() => record.operation.remove(index)}
            />
          ),
        },
      ] as TableProps<FormListRow>["columns"],
    []
  );

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
    <DashboardPageLayout containerMaxWidth="xl">
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

      <DashboardPageContentLayout>
        <Form
          id="editTask"
          form={form}
          layout="horizontal"
          onFinish={handleSubmit}
        >
          <Table
            scroll={{ x: 768 }}
            rowKey={() => "editTask-table"}
            bordered
            dataSource={[{}]}
            columns={columns}
            pagination={false}
          />

          <Divider orientation="left">Parameters</Divider>

          <Form.List name="parameters">
            {(fields, operation, meta) => (
              <>
                <Table
                  rowKey={(record) =>
                    `editTask-parameters-table-${record.field.name}`
                  }
                  scroll={{ x: 340 }}
                  className="max-w-screen-sm"
                  dataSource={fields.map(
                    (field) =>
                      ({
                        field,
                        meta,
                        operation,
                      } as FormListRow)
                  )}
                  columns={columns2}
                  pagination={false}
                  bordered
                />
                <Flex className="mt-4 basis-full">
                  <Button type="primary" onClick={() => operation.add()}>
                    + Add Sub Item
                  </Button>
                </Flex>
              </>
            )}
          </Form.List>
        </Form>
      </DashboardPageContentLayout>
    </DashboardPageLayout>
  );
};
