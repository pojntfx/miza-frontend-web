import * as React from "react";
import styled from "styled-components";
import { Box, Heading, Text } from "rebass";
import { Theme } from "theme-ui";
import { FaCheckSquare, FaRegCheckSquare, FaTrash } from "react-icons/fa";
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

    <HoverOnlyButton onClick={onClick} inverted>
      <FaTrash />
    </HoverOnlyButton>
  </Wrapper>
);

const HoverOnlyButton = styled(IconButton)`
  opacity: 0 !important;
`;

const Wrapper = styled(Box)<{ theme: Theme }>`
  padding: ${({ theme }) => theme.space[1]}rem !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  & > *:nth-child(2):not(:last-child) {
    flex: 1;
  }

  & > *:last-child {
    transition-duration: 0.2s;
    transition-timing-function: ease-in-out;
    transition-delay: initial;
    transition-property: all;
  }

  &:hover {
    & > *:last-child {
      opacity: 100% !important;
    }
  }
`;

const TodoSelectButton = styled(IconButton)<{ theme: Theme }>`
  margin-right: ${({ theme }) => (theme.space[1] as number) / 2}rem !important;
`;
