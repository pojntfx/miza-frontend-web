import * as React from "react";
import {
  ResponderProvided,
  DropResult,
  DragDropContext,
  Droppable,
  DragDropContextProps,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { Box } from "rebass";
import { Theme } from "theme-ui";
import {
  SwipeableList,
  IBaseSwipeableListProps,
} from "@sandstreamdev/react-swipeable-list";
import "@sandstreamdev/react-swipeable-list/dist/styles.css";

interface ISwipeNDragListProps {
  onDragEnd(result: DropResult, provided: ResponderProvided): void;
  droppableId: string;
  dragProps?: DragDropContextProps;
  swipeProps?: IBaseSwipeableListProps;
}

export const SwipeNDragList: React.FC<ISwipeNDragListProps> = ({
  children,
  onDragEnd,
  droppableId,
  dragProps,
  swipeProps,
  ...rest
}) => (
  <DragDropContext onDragEnd={onDragEnd} {...dragProps}>
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <Wrapper {...provided.droppableProps} ref={provided.innerRef} {...rest}>
          <SwipeableList {...swipeProps}>
            {children}
            {provided.placeholder}
          </SwipeableList>
        </Wrapper>
      )}
    </Droppable>
  </DragDropContext>
);

const Wrapper = styled(Box)<{ theme: Theme }>`
  margin-bottom: 4rem !important;

  > * {
    margin-top: -${({ theme }) => theme.space[1]}rem !important;
    display: flex;
    flex-direction: column;
    align-items: center;

    > * {
      width: calc(100% - ${({ theme }) => (theme.space[1] as number) * 2}rem);
      max-width: calc(
        ${({ theme }) => (theme.space[8] as number) * 4}px -
          ${({ theme }) => (theme.space[1] as number) * 2}rem
      );

      > * {
        > * {
          border-radius: ${({ theme }: { theme: Theme }) =>
            theme.space[1]}rem !important;

          &:first-of-type {
            background: red !important;
          }

          &:nth-of-type(2) {
            background: ${({ theme }) => theme.colors.primary} !important;
          }

          &:last-of-type {
            background: transparent !important;
          }
        }
      }
    }
  }
`;
