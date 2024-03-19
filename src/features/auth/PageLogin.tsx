import { Flex } from "antd";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../components/Logo";
import { LoginForm, type LoginFormValues } from "./LoginForm";

export const PageLogin = () => {
  const navigate = useNavigate();
  const handleLogin = (values: LoginFormValues) => {
    navigate("/dashboard");
  };

  return (
    <Flex flex={1}>
      <Flex
        className="hidden md:flex bg-gray-900 justify-center items-center"
        flex={1}
      >
        <Logo className="w-40 h-fit" />
      </Flex>
      <Flex
        vertical
        className="bg-gray-50 justify-center items-center"
        flex={1}
      >
        <LoginForm onFinish={handleLogin} />
      </Flex>
    </Flex>
  );
};
