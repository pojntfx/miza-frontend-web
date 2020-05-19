import * as React from "react";
import { TodosClient } from "../api/generated/api/todos_pb_service";
import { Todo, TodoID, NewTodo } from "../api/generated/api/todos_pb";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { ThemeProvider as ThemeUIThemeProvider, Theme } from "theme-ui";
import preset from "@rebass/preset";
import { Heading, Text, Card, Box, Button, Flex } from "rebass";
import styled from "styled-components";
import {
  FaPlus,
  FaRegCheckSquare,
  FaCog,
  FaTrash,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import { SyncLoader } from "react-spinners";
import { Transition } from "react-spring/renderprops";
import { LoaderSizeProps } from "react-spinners/interfaces";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import { Label, Input, Textarea } from "@rebass/forms";
import UpdateTodo from "./UpdateTodo";
import { ActionBar } from "./ActionBar";
import { Header } from "./Header";
import { SwipeNDragList } from "./SwipeNDragList";
import { SwipeNDragItem } from "./SwipeNDragItem";
import { TodoSummary } from "./TodoSummary";
import { TodoForm } from "./TodoForm";

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

const TodoLink = styled(Link)`
  text-decoration: inherit;
  color: inherit;
  overflow-x: auto;
  flex: 1;
`;

const Container = styled(Box)<{ theme: Theme }>`
  max-width: ${({ theme }) => (theme.space[8] as number) * 4}px;
  margin: 0 auto !important;
  padding: 0 ${({ theme }) => theme.space[1]}rem;
`;

const AddNoteButton = styled(Button)`
  background: #ff8833 !important;
  padding: ${({ theme }: { theme: Theme }) => (theme.space[1] as number) / 2}rem
    ${({ theme }: { theme: Theme }) => theme.space[1]}rem !important;
  border-radius: ${({ theme }: { theme: Theme }) =>
    theme.space[1]}rem !important;
  display: flex !important;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white !important;
  text-decoration: none;
  font-weight: bold;

  & > *:first-child {
    margin-right: ${({ theme }: { theme: Theme }) =>
      (theme.space[1] as number) / 2}rem;
  }

  &:active {
    background: #ff6a00 !important;
  }

  ${withHover(true, true)}
`;

const IconButton = styled(Button)<{ theme: Theme; inverted?: boolean }>`
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

const SwipeActionWrapper = styled(Box)<{ theme: Theme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }: { theme: Theme }) => theme.space[1]}rem;
  color: white !important;

  > * {
    &:first-of-type {
      margin-right: ${({ theme }: { theme: Theme }) =>
        (theme.space[1] as number) / 2}rem !important;
    }
  }
`;

const HoverButton = styled(Button)<{ theme: Theme }>`
  ${withHover(false, true)}

  display: flex !important;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }: { theme: Theme }) => (theme.space[1] as number) / 2}rem
    ${({ theme }: { theme: Theme }) => theme.space[1]}rem !important;

  & > *:last-child:not(:first-child) {
    margin-left: ${({ theme }: { theme: Theme }) =>
      (theme.space[1] as number) / 2}rem;
  }

  &:active {
    background: #00406e;
  }
`;

const theme = {
  ...preset,
  space: [0, 1, 2, 4, 8, 16, 32, 64, 128],
};

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

export const Loading = ({ loading }: { loading?: boolean }) => (
  <Transition
    items={loading}
    from={{ opacity: 0 }}
    enter={{ opacity: 1 }}
    leave={{ opacity: 0 }}
  >
    {(loading) =>
      loading &&
      ((props) => (
        <SyncLoader
          color="#ff6a00"
          size={7.5}
          loading={loading}
          css={(props as unknown) as LoaderSizeProps["css"]}
        />
      ))
    }
  </Transition>
);

export default () => {
  const client = new TodosClient(process.env.API_ENDPOINT);
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [loading, setLoading] = React.useState(false);

  const refreshTodos = () => {
    setLoading(true);

    client.list(new Todo(), (e, res) => {
      e ? console.error(e) : setTodos(res.getTodosList());

      setLoading(false);
    });
  };

  const deleteTodo = (id: number, title: string) => {
    const todoID = new TodoID();
    todoID.setId(id);

    const shouldDelete = confirm(`Do you want to delete todo ${title}?`);

    if (shouldDelete) {
      setLoading(true);

      client.delete(todoID, (e) => {
        e && console.error(e);

        refreshTodos();
      });
    }
  };

  React.useEffect(() => {
    refreshTodos();
  }, []);

  return (
    <StyledComponentsThemeProvider theme={theme}>
      <ThemeUIThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route
              path="/todos/:id"
              render={(props) => (
                <UpdateTodo
                  client={client}
                  id={parseInt(props.match.params.id)}
                />
              )}
            />
            <Route path="/new">
              {withRouter((props) => (
                <Container>
                  <Header
                    start={
                      <Heading fontSize={[5, 6, 7]} color="primary" as="h1">
                        New Todo
                      </Heading>
                    }
                    end={
                      <Flex>
                        <Loading loading={loading} />
                        <Link to="/">
                          <IconButton inverted>
                            <FaTimes />
                          </IconButton>
                        </Link>
                      </Flex>
                    }
                  />
                  <TodoForm
                    title=""
                    body=""
                    onSubmit={(e) => {
                      e.preventDefault();

                      const todo = new NewTodo();
                      todo.setTitle((e.target as any).title.value);
                      todo.setBody((e.target as any).body.value);

                      setLoading(true);

                      client.create(todo, (e) => {
                        e && console.error(e);

                        refreshTodos();

                        return props.history.push("/");
                      });
                    }}
                  />
                </Container>
              ))}
            </Route>
            <Route path="/">
              <Container>
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
                onDragEnd={(d) =>
                  console.log("Reordering", parseInt(d.draggableId))
                }
                droppableId="todos"
              >
                {todos.map((todo, i) => (
                  <SwipeNDragItem
                    key={todo.getId()}
                    draggableId={todo.getId().toString()}
                    index={i}
                    startItem={
                      <SwipeActionWrapper>
                        <FaTrash />
                        <span>Delete</span>
                      </SwipeActionWrapper>
                    }
                    startAction={() =>
                      deleteTodo(todo.getId(), todo.getTitle())
                    }
                    endItem={
                      <SwipeActionWrapper>
                        <FaRegCheckSquare />
                        <span>Select</span>
                      </SwipeActionWrapper>
                    }
                    endAction={() => console.log("Selecting", todo.getId())}
                  >
                    {() => (
                      <TodoSummary
                        title={todo.getTitle()}
                        body={todo.getBody()}
                        onClick={(e) => {
                          e.preventDefault();

                          deleteTodo(todo.getId(), todo.getTitle());
                        }}
                        as={TodoLink}
                        to={`/todos/${todo.getId()}`}
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
                  <AddNoteButton as={Link} to="/new">
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
            </Route>
          </Switch>
        </BrowserRouter>
      </ThemeUIThemeProvider>
    </StyledComponentsThemeProvider>
  );
};
