import * as React from "react";
import {
  DraggableProvided,
  DraggableStateSnapshot,
  DraggableProps,
  Draggable,
} from "react-beautiful-dnd";
import { SwipeableListItem } from "@sandstreamdev/react-swipeable-list";
import styled from "styled-components";
import { Card } from "rebass";
import { Theme } from "theme-ui";

interface ISwipeNDragItemProps {
  children: (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => React.ReactElement;
  draggableId: string;
  index: number;
  dragProps?: DraggableProps;
  swipeProps?: SwipeableListItem;
  startItem: React.ReactElement;
  startAction?: () => void;
  endItem: React.ReactElement;
  endAction?: () => void;
}

export const SwipeNDragItem: React.FC<ISwipeNDragItemProps> = ({
  children,
  draggableId,
  index,
  dragProps,
  swipeProps,
  startItem,
  startAction,
  endItem,
  endAction,
  ...rest
}) => (
  <Draggable draggableId={draggableId} index={index} {...dragProps}>
    {(provided, snapshot) => (
      <Wrapper
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={getItemStyle(provided.draggableProps.style)}
        {...rest}
      >
        <SwipeableListItem
          swipeLeft={{
            content: startItem,
            action: startAction,
          }}
          swipeRight={{
            content: endItem,
            action: endAction,
          }}
          {...swipeProps}
        >
          {children(provided, snapshot)}
        </SwipeableListItem>
      </Wrapper>
    )}
  </Draggable>
);

const getItemStyle = (draggableStyle: any) => {
  const { transform } = draggableStyle;
  let activeTransform = {};
  if (transform) {
    activeTransform = {
      transform: `translate(0, ${transform.substring(
        transform.indexOf(",") + 1,
        transform.indexOf(")")
      )})`,
    };
  }
  return {
    ...draggableStyle,
    ...activeTransform,
  };
};

const withHover = (
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

const Wrapper = styled(Card)<{ theme: Theme; style: any }>`
  padding: 0 !important;
  margin-left: ${({ theme }) => theme.space[1]}rem !important;
  margin-right: ${({ theme }) => theme.space[1]}rem !important;
  border-radius: ${({ theme }) => theme.space[1]}rem !important;
  margin-bottom: ${({ theme }) => theme.space[1]}rem !important;

  &:first-of-type {
    margin-top: ${({ theme }) => theme.space[1]}rem !important;
  }

  ${withHover(false, true)}
`;
