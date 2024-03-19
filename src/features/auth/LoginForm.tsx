import {
  Alert,
  Button,
  Flex,
  Form,
  Input,
  Typography,
  type FormProps,
} from "antd";
const { Text, Paragraph } = Typography;

export type LoginFormValues = {
  email: string;
};

type LoginFormProps = Omit<FormProps<LoginFormValues>, "children">;

export const LoginForm = ({ ...rest }: LoginFormProps) => {
  const [form] = Form.useForm<LoginFormValues>();

  return (
    <Form size="large" layout="vertical" name="login" form={form} {...rest}>
      <Flex vertical gap="small" className="items-center w-64">
        <Form.Item
          rules={[
            {
              pattern: /^\S+@\S+\.\S+$/,
              type: "string",
              message: "You should enter a valid email address",
            },
            {
              required: true,
              message: "Please enter your email address",
            },
          ]}
          label="Email"
          name={"email"}
          className="w-full"
        >
          <Input name="email" className="w-full" placeholder={"Email"} />
        </Form.Item>
        <Form.Item className="w-full">
          <Button
            // loading={login.isLoading || login.isSuccess}
            // disabled={form.is && !form.isValid}
            // type="submit"

            htmlType="submit"
            block
            type="primary"
          >
            Login
          </Button>
        </Form.Item>
        <Alert
          className="w-full"
          description={
            <Typography>
              <Text>Super user account is </Text>
              <Paragraph copyable strong underline>
                super@admin.com
              </Paragraph>
            </Typography>
          }
          type="info"
          showIcon
        />
      </Flex>
    </Form>
  );
};
