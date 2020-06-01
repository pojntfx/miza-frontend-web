export const withHover = (
  center: boolean,
  shadow?: boolean
) => `transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  transition-delay: initial;
  transition-property: all;
  cursor: pointer;

  &:hover {
    transform: ${center ? "translateX(-50%)" : ""} scale(1.05);
    ${shadow ? "box-shadow: 0 0 15px rgba(0, 0, 0, 0.13);" : ""}
  }

  &:active {
    transform: ${center ? "translateX(-50%)" : ""} scale(1);
    ${shadow ? "background: rgba(0, 0, 0, 0.13);" : ""}
  }`;
