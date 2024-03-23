import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useReorderProjectMutation,
  useRunProjectsMutation,
} from "@/api/projectApi";
import { useModalControl } from "@/components/Modal";
import {
  DashboardPageContentLayout,
  DashboardPageLayout,
} from "@/features/dashboard/DashboardContentLayout";
import { CreateProjectModal } from "@/features/projects/CreateProjectModal";
import type { ProjectResponse } from "@/features/projects/schema";
import { breakpoints } from "@/layout/breakpoint";
import {
  DeleteOutlined,
  DownOutlined,
  UpOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Flex,
  InputNumber,
  Popconfirm,
  Space,
  Table,
  Typography,
  type TableProps,
} from "antd";
import { useCallback, useMemo, useState } from "react";

export const PageProject = () => {
  const getProjectsQuery = useGetProjectsQuery();
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteProject, deleteProjectMutation] = useDeleteProjectMutation();
  const [reorderProject, reorderProjectMutation] = useReorderProjectMutation();
  const [runProject] = useRunProjectsMutation();

  const handleRun = () => {
    if (!getProjectsQuery.data) return;
    runProject({
      baseline: 1,
      cutOffDate: new Date().toISOString(),
      rateLimit: 1,
      taskIds: getProjectsQuery.data.map((x) => x.taskId),
    });
  };

  const {
    isModalOpen: isCreateProjectModalOpen,
    openModal: openCreateProjectModal,
    closeModal: closeCreateProjectModal,
  } = useModalControl();

  const handleDelete = useCallback(
    (projectId: number) => {
      deleteProject(projectId);
    },
    [deleteProject]
  );

  const columns = useMemo(
    () =>
      [
        {
          title: "Order",
          width: "10%",
          key: "id",
          render: (_, project) => (
            <Space size="middle">
              <Button
                type="text"
                icon={<UpOutlined />}
                onClick={() =>
                  reorderProject({
                    moveDirection: "up",
                    projectId: project.id,
                  })
                }
              />
              <Button
                type="text"
                icon={<DownOutlined />}
                onClick={() =>
                  reorderProject({
                    moveDirection: "down",
                    projectId: project.id,
                  })
                }
              />
            </Space>
          ),
        },
        {
          title: "Task Name",
          width: "50%",
          dataIndex: ["task", "name"],
          key: ["task", "name"],
        },
        {
          title: "Results in %",
          width: "20%",
          dataIndex: "result",
          key: "result",
          render: (result: number | null) =>
            result ? `${result.toFixed(2)}%` : "--",
        },
        {
          title: "Actions",
          width: "20%",
          key: "id",
          render: (_, project) => (
            <Popconfirm
              open={deleteConfirmVisible}
              okButtonProps={{ loading: deleteProjectMutation.isLoading }}
              onConfirm={() => handleDelete(project.id)}
              onCancel={() => setDeleteConfirmVisible(false)}
              title="Delete the project"
              description="Are you sure to delete this project?"
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon={<DeleteOutlined />}
                onClick={() => setDeleteConfirmVisible(true)}
                danger
              >
                Delete
              </Button>
            </Popconfirm>
          ),
        },
      ] as TableProps<ProjectResponse>["columns"],
    [
      deleteConfirmVisible,
      deleteProjectMutation.isLoading,
      handleDelete,
      reorderProject,
    ]
  );

  return (
    <>
      <DashboardPageLayout>
        <Flex vertical className="mb-4">
          <Typography.Title level={2}>Projects</Typography.Title>

          <Flex className="justify-between">
            <Space>
              <InputNumber placeholder="Base Line" />
              <DatePicker placeholder="Cut-off Date" />
              <InputNumber placeholder="Rate Limit" />
            </Space>

            <Button type="primary" onClick={handleRun}>
              Run
            </Button>
          </Flex>
        </Flex>

        <DashboardPageContentLayout>
          <Table
            dataSource={getProjectsQuery.data}
            scroll={{
              x: breakpoints.sm,
            }}
            className="max-w-screen-lg"
            columns={columns}
            pagination={false}
            bordered
            loading={
              getProjectsQuery.isLoading ||
              getProjectsQuery.isFetching ||
              reorderProjectMutation.isLoading
            }
          />

          <Button
            onClick={openCreateProjectModal}
            type="primary"
            icon={<UserAddOutlined />}
            className="w-fit mt-4"
          >
            Add Task
          </Button>
        </DashboardPageContentLayout>
      </DashboardPageLayout>

      <CreateProjectModal
        open={isCreateProjectModalOpen}
        closeModal={closeCreateProjectModal}
      />
    </>
  );
};
