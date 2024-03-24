import { useGetTaskQuery } from "@/api/tasksApi";
import { LoaderFull } from "@/components/LoaderFull";
import type { Task, TaskParameter } from "@/features/tasks/schema";
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

export type TaskFormValues = Modify<
  Task,
  {
    updateDate: Dayjs;
  }
>;

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

    form.setFieldsValue({
      ...getTaskQuery.data!,
      updateDate: dayjs(getTaskQuery.data.updateDate),
    });
  }, [form, getTaskQuery.data]);

  const taskParameterColumns = useMemo(
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
      ] as TableProps<TaskParameter>["columns"],
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
        dataSource={getTaskQuery.data?.parameters}
        columns={taskParameterColumns}
        pagination={false}
        bordered
      />
    </Modal>
  );
};
