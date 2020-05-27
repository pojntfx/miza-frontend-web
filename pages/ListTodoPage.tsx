import * as React from "react";
import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Heading } from "rebass";
import { SwipeNDragList } from "../components/SwipeNDragList";
import { SwipeNDragItem } from "../components/SwipeNDragItem";
import { SwipeActionWrapper } from "../components/SwipeActionWrapper";
import { FaTrash, FaRegCheckSquare, FaPlus, FaCog } from "react-icons/fa";
import { TodoSummary } from "../components/TodoSummary";
import { TodoLink } from "../components/TodoLink";
import { ActionBar } from "../components/ActionBar";
import { IconButton } from "../components/IconButton";
import { AddNoteButton } from "../components/AddNoteButton";
import { Link } from "react-router-dom";
import { Loading } from "../components/Loading";

interface IListTodoPageProps {
  todos: { id: number; title: string; body: string }[];
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
  onReorder: (id: number) => void;
  getPath: (id: number) => string;
  createPath: () => string;
  loading?: boolean;
}

export const ListTodoPage: React.FC<IListTodoPageProps> = ({
  todos,
  onDelete,
  onSelect,
  onReorder,
  loading,
  getPath,
  createPath,
  ...otherProps
}) => (
  <>
    <Container {...otherProps}>
      <Header
        start={
          <Heading fontSize={[5, 6, 7]} color="primary" as="h1">
            Todos
          </Heading>
        }
        end={<Loading loading={loading} />}
      ></Header>
    </Container>
    <SwipeNDragList
      onDragEnd={(d) => onReorder(parseInt(d.draggableId))}
      droppableId="todos"
    >
      {todos.map((todo, i) => (
        <SwipeNDragItem
          key={todo.id}
          draggableId={todo.id.toString()}
          index={i}
          startItem={
            <SwipeActionWrapper>
              <FaTrash />
              <span>Delete</span>
            </SwipeActionWrapper>
          }
          startAction={() => onDelete(todo.id)}
          endItem={
            <SwipeActionWrapper>
              <FaRegCheckSquare />
              <span>Select</span>
            </SwipeActionWrapper>
          }
          endAction={() => onSelect(todo.id)}
        >
          {() => (
            <TodoSummary
              title={todo.title}
              body={todo.body}
              onClick={(e) => {
                e.preventDefault();

                onDelete(todo.id);
              }}
              as={TodoLink}
              to={getPath(todo.id)}
            />
          )}
        </SwipeNDragItem>
      ))}
    </SwipeNDragList>
    <ActionBar
      start={
        <IconButton>
          <FaRegCheckSquare />
        </IconButton>
      }
      center={
        <AddNoteButton as={Link} to={createPath()}>
          <FaPlus />
          <span>Add Todo</span>
        </AddNoteButton>
      }
      end={
        <IconButton>
          <FaCog />
        </IconButton>
      }
    />
  </>
);
