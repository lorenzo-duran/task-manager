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
} from "antd";
import Column from "antd/es/table/Column";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";
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

  const getTaskQuery = useGetTaskQuery(+taskId!, {
    skip: !taskId,
  });
  const [editTask, editTaskMutation] = useEditTaskMutation();

  useEffect(() => {
    if (!getTaskQuery.data) return;

    form.setFieldsValue({
      ...getTaskQuery.data!,
      updateDate: dayjs(getTaskQuery.data.updateDate),
    });
  }, [form, getTaskQuery.data]);

  const handleSubmit = async () => {
    if (!taskId) return;
    const values = await form.validateFields();

    await editTask({
      taskId: +taskId,
      editTask: values,
    }).unwrap();

    navigate("/tasks");
  };

  if (getTaskQuery.isLoading || getTaskQuery.isFetching) return <LoaderFull />;

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
            pagination={false}
          >
            <Column
              title="Task Name"
              width="20%"
              render={() => (
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
              )}
            />
            <Column
              title="Description"
              width="40%"
              render={() => (
                <Form.Item name="description">
                  <Input.TextArea rows={2} />
                </Form.Item>
              )}
            />
            <Column
              title="Type"
              width="20%"
              render={() => (
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
              )}
            />
            <Column
              title="Update Date"
              width="20%"
              render={() => (
                <Form.Item name="updateDate">
                  <DatePicker disabled />
                </Form.Item>
              )}
            />
          </Table>

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
                  pagination={false}
                  bordered
                >
                  <Column<FormListRow>
                    title="Key"
                    dataIndex={["field", "key"]}
                    render={(_, record) => (
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
                    )}
                  />
                  <Column<FormListRow>
                    title="Value"
                    dataIndex={["field", "value"]}
                    render={(_, record) => (
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
                    )}
                  />
                  <Column<FormListRow>
                    title="Actions"
                    render={(_, record, index) => (
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => record.operation.remove(index)}
                      />
                    )}
                  />
                </Table>
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
