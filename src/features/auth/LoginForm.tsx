import { useLoginMutation } from "@/api/authApi";
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

type LoginFormProps = Omit<
  FormProps<LoginFormValues>,
  "children" | "onFinish"
> & {
  onLogin?: () => void;
};

export const LoginForm = ({ onLogin, ...rest }: LoginFormProps) => {
  const [form] = Form.useForm<LoginFormValues>();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = (values: LoginFormValues) => {
    login({
      email: values.email,
    })
      .unwrap()
      .then(onLogin);
  };

  return (
    <Form
      size="large"
      layout="vertical"
      name="login"
      form={form}
      onFinish={handleSubmit}
      {...rest}
    >
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
          <Button loading={isLoading} htmlType="submit" block type="primary">
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
