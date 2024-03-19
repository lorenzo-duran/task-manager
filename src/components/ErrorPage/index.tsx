import { Button, Flex, Typography } from "antd";
import { Link } from "react-router-dom";
import { Logo } from "../Logo";

const { Text, Title } = Typography;

type ErrorPageProps = {
  authorization?: boolean;
};

export const ErrorPage: React.FC<ErrorPageProps> = ({ authorization }) => {
  return (
    <Flex flex="1" className="bg-gray-50 justify-center items-center">
      <Flex className="text-left items-center flex-col">
        <Logo className="w-20 h-fit" />
        <Title>{authorization ? "Authorization Error" : "Error"}</Title>
        <Text className="mb-4">
          {authorization
            ? "You don't have access to this page"
            : "Something went wrong 😞"}
        </Text>
        <Link to="/">
          <Button size="large">Go back to Home Screen</Button>
        </Link>
      </Flex>
    </Flex>
  );
};
