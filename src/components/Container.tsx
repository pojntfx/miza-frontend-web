import styled from "styled-components";
import { Box } from "rebass";
import { Theme } from "theme-ui";

export const Container = styled(Box)<{ theme: Theme }>`
  max-width: ${({ theme }) => (theme.space[8] as number) * 4}px;
  margin: 0 auto !important;
  padding: 0 ${({ theme }) => theme.space[1]}rem;
`;
