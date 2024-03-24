import { useGetTasksQuery } from "@/api/tasksApi";
import { useModalControl } from "@/components/Modal";
import { useCheckActionPermission } from "@/features/auth/auth.helpers";
import {
  DashboardPageContentLayout,
  DashboardPageLayout,
} from "@/features/dashboard/DashboardContentLayout";
import { CreateTaskFormModal } from "@/features/tasks/CreateTaskForm";
import { DeleteTaskModal } from "@/features/tasks/DeleteTaskModal";
import { PreviewTaskModal } from "@/features/tasks/PreviewTaskModal";
import type { Task } from "@/features/tasks/schema";
import { formatDateFromString } from "@/lib/date";
import { UserAddOutlined } from "@ant-design/icons";
import { Button, Flex, Space, Table, Typography } from "antd";
import type { TableProps } from "antd/es/table";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export const TaskListPage: React.FC = () => {
  const getTasks = useGetTasksQuery();

  const hasDeletePermission = useCheckActionPermission("DELETE_TASKS");
  const hasEditPermission = useCheckActionPermission("EDIT_TASKS");

  const createTaskModalControl = useModalControl();
  const deleteTaskModalControl = useModalControl<{ taskId: number }>();
  const previewTaskModalControl = useModalControl<{ taskId: number }>();

  const columns = useMemo(
    () =>
      [
        {
          title: "ID",
          dataIndex: "id",
          fixed: "left",
          key: "id",
          sorter: (a, b) => a.id - b.id,
        },
        {
          title: "Name",
          dataIndex: "name",
          fixed: "left",
          key: "name",
          render: (name: Task["name"], task) => (
            <Button
              onClick={() => previewTaskModalControl.open({ taskId: task.id })}
              type="link"
            >
              {name}
            </Button>
          ),
        },
        {
          title: "Update Date",
          dataIndex: "updateDate",
          key: "updateDate",
          render: (date: Task["updateDate"]) => (
            <Typography.Text>{formatDateFromString(date)}</Typography.Text>
          ),
          sorter: (a, b) => a.updateDate > b.updateDate,
        },
        {
          title: "Type",
          dataIndex: "type",
          key: "type",
        },
        {
          title: "Actions",
          key: "actions",
          width: 120,
          render: (_, task) => (
            <Space>
              <Typography.Link disabled={!hasEditPermission}>
                <Link to={`${task.id}/edit`}>Edit</Link>
              </Typography.Link>
              <Typography.Link
                onClick={() => deleteTaskModalControl.open({ taskId: task.id })}
                disabled={!hasDeletePermission}
              >
                Delete
              </Typography.Link>
            </Space>
          ),
        },
      ] as TableProps<Task>["columns"],
    [
      hasDeletePermission,
      deleteTaskModalControl,
      hasEditPermission,
      previewTaskModalControl,
    ]
  );

  return (
    <>
      <DashboardPageLayout>
        <Flex className="flex-row justify-between items-center">
          <Typography.Title level={2}>Tasks</Typography.Title>
          <Button
            onClick={createTaskModalControl.open}
            type="primary"
            icon={<UserAddOutlined />}
          >
            Add
          </Button>
        </Flex>

        <DashboardPageContentLayout>
          <Table
            bordered
            columns={columns}
            dataSource={getTasks.data}
            rowKey="id"
            loading={getTasks.isLoading}
            pagination={false}
          />
        </DashboardPageContentLayout>
      </DashboardPageLayout>

      <CreateTaskFormModal
        closeModal={createTaskModalControl.close}
        open={createTaskModalControl.isOpen}
      />
      <DeleteTaskModal
        onCloseModal={deleteTaskModalControl.close}
        open={deleteTaskModalControl.isOpen}
        taskId={deleteTaskModalControl.args?.taskId}
      />
      <PreviewTaskModal
        closeModal={previewTaskModalControl.close}
        open={previewTaskModalControl.isOpen}
        taskId={previewTaskModalControl.args?.taskId}
      />
    </>
  );
};
