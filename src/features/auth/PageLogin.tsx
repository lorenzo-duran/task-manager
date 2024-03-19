import { Flex } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Logo } from "../../components/Logo";
import { LoginForm } from "./LoginForm";

export const PageLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const handleLogin = () => {
    navigate(searchParams.get("redirect") || "/");
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
        <LoginForm onLogin={handleLogin} />
      </Flex>
    </Flex>
  );
};
