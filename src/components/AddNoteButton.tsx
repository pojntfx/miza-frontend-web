import styled from "styled-components";
import { Button } from "rebass";
import { Theme } from "theme-ui";
import { withHover } from "../utils/withHover";

export const AddNoteButton = styled(Button)<{ theme: Theme }>`
  background: #ff8833 !important;
  padding: ${({ theme }) => (theme.space[1] as number) / 2}rem
    ${({ theme }) => theme.space[1]}rem !important;
  border-radius: ${({ theme }) => theme.space[1]}rem !important;
  display: flex !important;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white !important;
  text-decoration: none;
  font-weight: bold;

  & > *:first-child {
    margin-right: ${({ theme }) => (theme.space[1] as number) / 2}rem;
  }

  &:active {
    background: #ff6a00 !important;
  }

  ${withHover(true, true)}
`;
