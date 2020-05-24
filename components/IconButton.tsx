import styled from "styled-components";
import { Button } from "rebass";
import { Theme } from "theme-ui";

export const IconButton = styled(Button)<{ theme: Theme; inverted?: boolean }>`
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
