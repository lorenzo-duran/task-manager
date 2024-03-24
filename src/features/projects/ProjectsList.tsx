import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useReorderProjectMutation,
  useRunProjectsMutation,
} from "@/api/projectsApi";
import { useModalControl } from "@/components/Modal";
import { useCheckActionPermission } from "@/features/auth/auth.helpers";
import {
  DashboardPageContentLayout,
  DashboardPageLayout,
} from "@/features/dashboard/DashboardContentLayout";
import { CreateProjectModal } from "@/features/projects/CreateProjectModal";
import type { ProjectResponse, RunProjects } from "@/features/projects/schema";
import { PreviewTaskModal } from "@/features/tasks/PreviewTaskModal";
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
  Form,
  InputNumber,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import Column from "antd/es/table/Column";
import type { Dayjs } from "dayjs";
import { useCallback, useState } from "react";

type RunProjectFormValues = Modify<
  Omit<RunProjects, "tasks">,
  {
    cutOffDate: Dayjs;
  }
>;

export const PageProject = () => {
  const getProjectsQuery = useGetProjectsQuery();
  const [deleteConfirmVisibleIndex, setDeleteConfirmVisibleIndex] =
    useState(-1);
  const [deleteProject, deleteProjectMutation] = useDeleteProjectMutation();
  const [reorderProject, reorderProjectMutation] = useReorderProjectMutation();
  const [runProject, runProjectMutation] = useRunProjectsMutation();

  const hasDeletePermission = useCheckActionPermission("DELETE_PROJECTS");
  const hasEditPermission = useCheckActionPermission("EDIT_PROJECTS");
  const hasRunPermission = useCheckActionPermission("RUN_PROJECTS");

  const [form] = Form.useForm<RunProjectFormValues>();

  const handleRun = async () => {
    if (!getProjectsQuery.data) return;
    const values = await form.validateFields();
    await runProject({
      ...values,
      cutOffDate: values.cutOffDate.toISOString(),
      taskIds: getProjectsQuery.data.map((x) => x.taskId),
    }).unwrap();
  };

  const {
    isOpen: isCreateProjectModalOpen,
    open: openCreateProjectModal,
    close: closeCreateProjectModal,
  } = useModalControl();

  const {
    isOpen: isPreviewTaskModalOpen,
    open: openPreviewTaskModal,
    close: closePreviewTaskModal,
    args: previewTaskArgs,
  } = useModalControl<{ taskId: number }>();

  const handleDelete = useCallback(
    (projectId: number) => {
      deleteProject(projectId);
      setDeleteConfirmVisibleIndex(-1);
    },

    [deleteProject]
  );

  const isLastProject = useCallback(
    (index: number) => {
      if (!getProjectsQuery.data?.length) return false;

      if (getProjectsQuery.data?.length - 1 === index) return true;
      return false;
    },
    [getProjectsQuery.data?.length]
  );

  return (
    <>
      <DashboardPageLayout>
        <Flex vertical className="mb-4">
          <Typography.Title level={2}>Projects</Typography.Title>

          <Flex className="justify-between">
            <Form id="runProject" form={form} layout="inline">
              <Form.Item
                name="baseline"
                rules={[
                  {
                    required: true,
                    min: 0,
                    type: "number",
                  },
                ]}
              >
                <InputNumber placeholder="Base Line" />
              </Form.Item>

              <Form.Item
                name="cutOffDate"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <DatePicker placeholder="Cut-off Date" />
              </Form.Item>

              <Form.Item
                name="rateLimit"
                rules={[
                  {
                    type: "number",
                    min: 0,
                    required: true,
                  },
                ]}
              >
                <InputNumber placeholder="Rate Limit" />
              </Form.Item>
            </Form>

            <Button
              type="primary"
              disabled={!hasRunPermission}
              loading={runProjectMutation.isLoading}
              onClick={handleRun}
            >
              Run
            </Button>
          </Flex>
        </Flex>

        <DashboardPageContentLayout>
          <Table<ProjectResponse>
            dataSource={getProjectsQuery.data}
            scroll={{
              x: breakpoints.sm,
            }}
            rowKey={"id"}
            className="max-w-screen-lg"
            pagination={false}
            bordered
            loading={
              getProjectsQuery.isLoading ||
              getProjectsQuery.isFetching ||
              reorderProjectMutation.isLoading ||
              deleteProjectMutation.isLoading
            }
          >
            <Column<ProjectResponse>
              title="Order"
              key="id"
              width="10%"
              render={(_, project, index) => (
                <Space size="middle">
                  <Button
                    type="text"
                    icon={<UpOutlined />}
                    disabled={index === 0 || !hasEditPermission}
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
                    disabled={isLastProject(index) || !hasEditPermission}
                    onClick={() =>
                      reorderProject({
                        moveDirection: "down",
                        projectId: project.id,
                      })
                    }
                  />
                </Space>
              )}
            />
            <Column<ProjectResponse>
              title="Task Name"
              dataIndex={["task", "name"]}
              width="50%"
              render={(name: string, task) => (
                <Button
                  onClick={() => openPreviewTaskModal({ taskId: task.id })}
                  type="link"
                >
                  {name}
                </Button>
              )}
            />
            <Column<ProjectResponse>
              title="Results in %"
              dataIndex="result"
              width="20%"
              render={(result: number | null) =>
                result ? `${result.toFixed(2)}%` : "--"
              }
            />
            <Column<ProjectResponse>
              title="Actions"
              width="20%"
              render={(_, project, index) => (
                <Popconfirm
                  open={deleteConfirmVisibleIndex === index}
                  okButtonProps={{ loading: deleteProjectMutation.isLoading }}
                  onConfirm={() => handleDelete(project.id)}
                  onCancel={() => setDeleteConfirmVisibleIndex(-1)}
                  title="Delete the project"
                  description="Are you sure to delete this project?"
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => setDeleteConfirmVisibleIndex(index)}
                    danger
                    disabled={!hasDeletePermission}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              )}
            />
          </Table>

          <Button
            onClick={openCreateProjectModal}
            type="primary"
            disabled={!hasEditPermission}
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
      <PreviewTaskModal
        closeModal={closePreviewTaskModal}
        open={isPreviewTaskModalOpen}
        taskId={previewTaskArgs?.taskId}
      />
    </>
  );
};
