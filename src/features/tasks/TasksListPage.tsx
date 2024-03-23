import { useGetTasksQuery } from "@/api/tasksApi";
import { useModalControl } from "@/components/Modal";
import { useCheckActionPermission } from "@/features/auth/auth.helpers";
import {
  DashboardPageContentLayout,
  DashboardPageLayout,
} from "@/features/dashboard/DashboardContentLayout";
import { CreateTaskFormModal } from "@/features/tasks/CreateTaskForm";
import { DeleteTaskModal } from "@/features/tasks/DeleteTaskModal";
import type { Task } from "@/features/tasks/schema";
import { formatDateFromString } from "@/lib/date";
import { UserAddOutlined } from "@ant-design/icons";
import { Button, Flex, Space, Table, Typography } from "antd";
import type { TableProps } from "antd/es/table";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export const TaskListPage: React.FC = () => {
  const getTasks = useGetTasksQuery();

  const deleteButtonEnabled = useCheckActionPermission("DELETE_TASKS");
  const editButtonEnabled = useCheckActionPermission("EDIT_TASKS");

  const {
    isModalOpen: isCreateTaskModalOpen,
    openModal: openCreateTaskModal,
    closeModal: closeCreateTaskModal,
  } = useModalControl();

  const {
    isModalOpen: isDeleteTaskModalOpen,
    openModal: openDeleteTaskModal,
    closeModal: closeDeleteTaskModal,
    modalArgs: deleteTaskArgs,
  } = useModalControl<{ taskId: number }>();

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
              <Typography.Link disabled={!editButtonEnabled}>
                <Link to={`${task.id}/edit`}>Edit</Link>
              </Typography.Link>
              <Typography.Link
                onClick={() => openDeleteTaskModal({ taskId: task.id })}
                disabled={!deleteButtonEnabled}
              >
                Delete
              </Typography.Link>
            </Space>
          ),
        },
      ] as TableProps<Task>["columns"],
    [deleteButtonEnabled, editButtonEnabled, openDeleteTaskModal]
  );

  return (
    <>
      <DashboardPageLayout>
        <Flex className="flex-row justify-between items-center">
          <Typography.Title level={2}>Tasks</Typography.Title>
          <Button
            onClick={openCreateTaskModal}
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
        closeModal={closeCreateTaskModal}
        open={isCreateTaskModalOpen}
      />

      <DeleteTaskModal
        closeModal={closeDeleteTaskModal}
        open={isDeleteTaskModalOpen}
        taskId={deleteTaskArgs?.taskId}
      />
    </>
  );
};
