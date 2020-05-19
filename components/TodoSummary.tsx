import * as React from "react";
import styled from "styled-components";
import { Button, Box, Heading, Text } from "rebass";
import { Theme } from "theme-ui";
import { FaTimes } from "react-icons/fa";

interface ITodoSummaryProps {
  title: string;
  body: string;
  as?: any;
  to?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const TodoSummary: React.FC<ITodoSummaryProps> = ({
  title,
  body,
  onClick,
  ...rest
}) => (
  <Wrapper {...rest}>
    <Box overflowX="auto" mr={3}>
      {title != "" && <Heading>{title}</Heading>}
      {body != "" && <Text>{body}</Text>}
    </Box>

    <IconButton onClick={onClick} inverted>
      <FaTimes />
    </IconButton>
  </Wrapper>
);

const Wrapper = styled(Box)<{ theme: Theme }>`
  padding: ${({ theme }) => theme.space[1]}rem !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const IconButton = styled(Button)<{ theme: Theme; inverted?: boolean }>`
  min-width: initial !important;

  cursor: pointer;
  display: flex !important;
  justify-content: center;
  align-items: center;

  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  transition-delay: initial;
  transition-property: all;
  cursor: pointer;

  color: ${({ theme, inverted }) =>
    inverted ? `${theme.colors.text} !important` : "inherit"};
  background: transparent !important;

  &:hover,
  &:active {
    color: ${({ inverted }) => (inverted ? "red" : "#d9d9d9")} !important;
  }
`;
