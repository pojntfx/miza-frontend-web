import styled from "styled-components";
import { Box } from "rebass";
import { Theme } from "theme-ui";

export const SwipeActionWrapper = styled(Box)<{ theme: Theme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[1]}rem;
  color: white !important;

  > * {
    &:first-of-type {
      margin-right: ${({ theme }) =>
        (theme.space[1] as number) / 2}rem !important;
    }
  }
`;
