import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useReorderProjectMutation,
  useRunProjectsMutation,
} from "@/api/projectApi";
import { useModalControl } from "@/components/Modal";
import { CreateProjectModal } from "@/features/projects/CreateProjectModal";
import type { ProjectResponse } from "@/features/projects/schema";
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
  const [runProject, runProjectMutation] = useRunProjectsMutation();

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
          title: "",
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
          dataIndex: ["task", "name"],
          key: ["task", "name"],
          render: (name: string) => <Typography.Link>{name}</Typography.Link>,
        },
        {
          title: "Results in %",
          dataIndex: "result",
          key: "result",
          render: (result: number | null) => (result ? `${result.toFixed(2)}%` : "--"),
        },
        {
          title: "Actions",
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
      <Flex className="m-6 flex-col max-w-screen-xl gap-4">
        <Flex className="flex-row justify-between">
          <Space>
            <InputNumber placeholder="Base Line" />
            <DatePicker placeholder="Cut-off Date" />
            <InputNumber placeholder="Rate Limit" />
          </Space>

          <Button type="primary" onClick={handleRun}>
            Run
          </Button>
        </Flex>

        <Table
          dataSource={getProjectsQuery.data}
          columns={columns}
          pagination={false}
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
          className="w-fit"
        >
          Add Task
        </Button>
      </Flex>

      <CreateProjectModal
        open={isCreateProjectModalOpen}
        closeModal={closeCreateProjectModal}
      />
    </>
  );
};
