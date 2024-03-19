import { Flex, Spin } from "antd";

export const LoaderFull = () => {
  return (
    <Flex className="justify-center items-center" flex="1">
      <Spin />
    </Flex>
  );
};
