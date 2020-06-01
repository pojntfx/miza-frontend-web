import * as React from "react";
import styled from "styled-components";
import { Box } from "rebass";
import { Theme } from "theme-ui";

interface IActionBarProps {
  start: React.ReactElement;
  center: React.ReactElement;
  end: React.ReactElement;
}

export const ActionBar: React.FC<IActionBarProps> = ({
  start,
  center,
  end,
  ...rest
}) => (
  <Toolbar {...rest}>
    {start}
    {center}
    {end}
  </Toolbar>
);

const Toolbar = styled(Box)<{ theme: Theme }>`
  position: fixed;
  bottom: 0;
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.space[1]}rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadows.card};

  > :nth-child(2) {
    position: fixed;
    bottom: ${({ theme }) => theme.space[2]}rem;
    left: 50%;
    transform: translateX(-50%);
  }
`;
