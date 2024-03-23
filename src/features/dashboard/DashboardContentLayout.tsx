import { breakpoints } from "@/layout/breakpoint";
import { Flex, type FlexProps } from "antd";
import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export type DashboardPageLayoutProps = {
  containerMaxWidth?: keyof typeof breakpoints;
} & FlexProps;

export const DashboardPageLayout: React.FC<
  PropsWithChildren<DashboardPageLayoutProps>
> = ({ children, containerMaxWidth = "xxl", className, style, ...rest }) => {
  return (
    <Flex
      vertical
      style={{
        maxWidth: breakpoints[containerMaxWidth],
        ...style,
      }}
      className={twMerge("p-4", className)}
      {...rest}
    >
      {children}
    </Flex>
  );
};

export const DashboardPageContentLayout: React.FC<
  PropsWithChildren<FlexProps>
> = ({ children, className, ...rest }) => {
  return (
    <Flex
      vertical
      className={twMerge("rounded bg-white p-8", className)}
      {...rest}
    >
      {children}
    </Flex>
  );
};
