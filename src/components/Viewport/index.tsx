import { Flex } from "antd";
import { type PropsWithChildren } from "react";

export const Viewport: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Flex className="min-h-screen w-full overflow-x-auto flex-col">
      {children}
    </Flex>
  );
};
