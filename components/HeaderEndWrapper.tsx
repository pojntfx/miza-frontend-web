import { Flex } from "rebass";
import styled from "styled-components";
import { Theme } from "theme-ui";

export const HeaderEndWrapper = styled(Flex)<{ theme: Theme }>`
  > *:not(:last-child) {
    margin-right: ${({ theme }) => theme.space[1] / 2}rem;
  }
`;
