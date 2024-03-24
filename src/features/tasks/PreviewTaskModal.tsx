import { useGetTaskQuery } from "@/api/tasksApi";
import { LoaderFull } from "@/components/LoaderFull";
import type { Task } from "@/features/tasks/schema";
import {
  Form,
  Input,
  Modal,
  Select,
  Table,
  type ModalProps,
  type TableProps,
  DatePicker,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";

export type TaskFormValues = Omit<Task, "parameters" | "updateDate"> & {
  parameters: { key: string; value: string }[];
  updateDate: Dayjs;
};

type CreateTaskFormModalProps = Omit<ModalProps, "onOk"> & {
  closeModal: () => void;
  taskId?: number;
};

export const PreviewTaskModal = ({
  closeModal,
  taskId,
  ...rest
}: CreateTaskFormModalProps) => {
  const [form] = Form.useForm<TaskFormValues>();
  const getTaskQuery = useGetTaskQuery(taskId!, {
    skip: !taskId,
  });

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

  const columns2 = useMemo(
    () =>
      [
        {
          title: "Key",
          dataIndex: "key",
        },
        {
          title: "Value",
          dataIndex: "value",
        },
      ] as TableProps<{
        key: string;
        value: string;
      }>["columns"],
    []
  );

  if (getTaskQuery.isLoading)
    return (
      <Modal
        title="Preview Task"
        okText="Back"
        onOk={closeModal}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
        {...rest}
      >
        <LoaderFull />
      </Modal>
    );

  return (
    <Modal
      onCancel={closeModal}
      title="Preview Task"
      okText={"Back"}
      onOk={closeModal}
      cancelButtonProps={{
        style: {
          display: "none",
        },
      }}
      {...rest}
    >
      <Form layout="vertical" form={form} disabled>
        <Form.Item label="Task Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Type" name="type">
          <Select>
            <Select.Option value="set-status">Set-Status</Select.Option>
            <Select.Option value="run">Run</Select.Option>
            <Select.Option value="delete">Delete</Select.Option>
            <Select.Option value="create">Create</Select.Option>
            <Select.Option value="modify">Modify</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Update Date" name="updateDate">
          <DatePicker />
        </Form.Item>
      </Form>
      <Table
        rowKey={(record) =>
          `editTask-parameters-table-${record.key}-${record.value}`
        }
        scroll={{ x: 340 }}
        className="max-w-screen-sm"
        dataSource={
          getTaskQuery.data?.parameters
            ? Object.entries(getTaskQuery.data.parameters).map((p) => ({
                key: p[0],
                value: p[1],
              }))
            : []
        }
        columns={columns2}
        pagination={false}
        bordered
      />
    </Modal>
  );
};
