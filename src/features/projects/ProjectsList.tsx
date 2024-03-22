import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
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

  const handleRun = () => {};

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
          render: () => (
            <Space size="middle">
              <UpOutlined />
              <DownOutlined />
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
          render: (result: number | undefined) => (result ? result : "--"),
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
    [deleteConfirmVisible, deleteProjectMutation.isLoading, handleDelete]
  );

  return (
    <>
      <Flex className="m-6 flex-col max-w-screen-xl gap-4">
        <Flex className="flex-row justify-between">
          <Space>
            <InputNumber
              // value={baseLine}
              // onChange={setBaseLine}
              placeholder="Base Line"
            />
            <DatePicker
              // value={cutOffDate}
              // onChange={setCutOffDate}
              placeholder="Cut-off Date"
            />
            <InputNumber
              // value={rateLimit}
              // onChange={setRateLimit}
              placeholder="Rate Limit"
            />
          </Space>

          <Button type="primary" onClick={handleRun}>
            Run
          </Button>
        </Flex>

        <Table
          dataSource={getProjectsQuery.data}
          columns={columns}
          pagination={false}
          loading={getProjectsQuery.isLoading}
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
