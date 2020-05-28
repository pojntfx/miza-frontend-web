import * as React from "react";
import styled from "styled-components";
import { Box, Heading, Text } from "rebass";
import { Theme } from "theme-ui";
import { FaTimes, FaCheckSquare, FaRegCheckSquare } from "react-icons/fa";
import { IconButton } from "./IconButton";

interface ITodoSummaryProps {
  title: string;
  body: string;
  as?: any;
  to?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  selectMode?: boolean;
  onToggleSelect: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  selected?: boolean;
}

export const TodoSummary: React.FC<ITodoSummaryProps> = ({
  title,
  body,
  onClick,
  selectMode,
  onToggleSelect,
  selected,
  ...rest
}) => (
  <Wrapper {...rest}>
    {(selectMode || selected) && (
      <TodoSelectButton onClick={onToggleSelect} inverted primary>
        {selected ? <FaCheckSquare /> : <FaRegCheckSquare />}
      </TodoSelectButton>
    )}

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

  & > *:nth-child(2):not(:last-child) {
    flex: 1;
  }
`;

const TodoSelectButton = styled(IconButton)<{ theme: Theme }>`
  margin-right: ${({ theme }) => (theme.space[1] as number) / 2}rem !important;
`;
