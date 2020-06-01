import * as React from "react";
import styled from "styled-components";
import { Box } from "rebass";
import { Theme } from "theme-ui";
import { IconButton } from "./IconButton";
import { FaTimes, FaTrash } from "react-icons/fa";
import { HeaderEndWrapper } from "./HeaderEndWrapper";

interface ISelectionBarProps {
  selected: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onDiscard: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const SelectionBar: React.FC<ISelectionBarProps> = ({
  selected,
  onClick,
  onDiscard,
  ...otherProps
}) => (
  <Wrapper {...otherProps}>
    <span>
      <strong>{selected}</strong> todos selected
    </span>
    <HeaderEndWrapper>
      <IconButton onClick={onClick}>
        <FaTrash />
      </IconButton>
      <IconButton onClick={onDiscard}>
        <FaTimes />
      </IconButton>
    </HeaderEndWrapper>
  </Wrapper>
);

const Wrapper = styled(Box)<{ theme: Theme }>`
  z-index: 999;
  position: sticky;
  top: 0;
  width: 100%;
  background: red;
  padding: ${({ theme }) => theme.space[1]}rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadows.card};
  color: white;
`;
