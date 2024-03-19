import { Flex, Typography } from "antd";
const { Text } = Typography;

export const Projects: React.FC = () => {
  return (
    <Flex vertical>
      <Text>{"Projects"}</Text>
      {Array.from({ length: 100 }).map((__, j) => (
        <Flex gap={1} key={j}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "25%",
                height: 54,

                backgroundColor: i % 2 ? "#1677ff" : "#1677ffbf",
              }}
            />
          ))}
        </Flex>
      ))}
    </Flex>
  );
};
