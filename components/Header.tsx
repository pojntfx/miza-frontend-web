import * as React from "react";
import styled from "styled-components";
import { Box } from "rebass";
import { Theme } from "theme-ui";

interface IHeaderProps {
  start: React.ReactElement;
  end?: React.ReactElement;
}

export const Header: React.FC<IHeaderProps> = ({ start, end, ...rest }) => (
  <Wrapper start={start} {...rest}>
    {start}
    {end}
  </Wrapper>
);

const Wrapper = styled(Box)<{ theme: Theme; start?: any }>`
  padding-top: ${({ theme }) => theme.space[1]}rem !important;
  padding-bottom: ${({ theme }) => theme.space[1]}rem !important;
  display: flex;
  justify-content: ${({ start }) => (start ? "space-between" : "flex-end")};
  align-items: center;
`;
