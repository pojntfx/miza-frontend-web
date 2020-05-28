import * as React from "react";

interface ISelectionBarProps {
  selected: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onDiscard: () => void;
}

export const SelectionBar: React.FC<ISelectionBarProps> = ({
  selected,
  onClick,
  onDiscard,
  ...otherProps
}) => <>{selected}</>;
