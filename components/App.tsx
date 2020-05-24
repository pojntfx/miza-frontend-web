import * as React from "react";
import { TodosClient } from "../api/generated/api/todos_pb_service";
import { Todo, TodoID, NewTodo } from "../api/generated/api/todos_pb";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { ThemeProvider as ThemeUIThemeProvider, Theme } from "theme-ui";
import preset from "@rebass/preset";
import { Heading, Box, Button, Flex } from "rebass";
import styled from "styled-components";
import {
  FaPlus,
  FaRegCheckSquare,
  FaCog,
  FaTrash,
  FaTimes,
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
import UpdateTodo from "./UpdateTodo";
import { ActionBar } from "./ActionBar";
import { Header } from "./Header";
import { SwipeNDragList } from "./SwipeNDragList";
import { SwipeNDragItem } from "./SwipeNDragItem";
import { TodoSummary } from "./TodoSummary";
import { TodoForm } from "./TodoForm";
import { GoogleLogin } from "react-google-login";
import { BrowserHeaders } from "browser-headers";
import { Container } from "./Container";
import { IconButton } from "./IconButton";
import { NewTodoPage } from "../pages/NewTodoPage";

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

const theme = {
  ...preset,
  space: [0, 1, 2, 4, 8, 16, 32, 64, 128],
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
  const [token, setToken] = React.useState("");

  const refreshTodos = () => {
    setLoading(true);

    client.list(
      new Todo(),
      new BrowserHeaders({
        Authorization: `Bearer ${token}`,
      }),
      (e, res) => {
        e ? console.error(e) : setTodos(res.getTodosList());

        setLoading(false);
      }
    );
  };

  const deleteTodo = (id: number, title: string) => {
    const todoID = new TodoID();
    todoID.setId(id);

    const shouldDelete = confirm(`Do you want to delete todo ${title}?`);

    if (shouldDelete) {
      setLoading(true);

      client.delete(
        todoID,
        new BrowserHeaders({
          Authorization: `Bearer ${token}`,
        }),
        (e) => {
          e && console.error(e);

          refreshTodos();
        }
      );
    }
  };

  React.useEffect(() => {
    token && refreshTodos();
  }, [token]);

  return token ? (
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
                  token={token}
                />
              )}
            />
            <Route path="/new">
              {withRouter((props) => (
                <NewTodoPage
                  loading={loading}
                  onSubmit={(title, body) => {
                    const todo = new NewTodo();
                    todo.setTitle(title);
                    todo.setBody(body);

                    setLoading(true);

                    client.create(
                      todo,
                      new BrowserHeaders({
                        Authorization: `Bearer ${token}`,
                      }),
                      (e) => {
                        e && console.error(e);

                        refreshTodos();

                        return props.history.push("/");
                      }
                    );
                  }}
                />
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
  ) : (
    <GoogleLogin
      onSuccess={(res) => setToken((res as any).tokenId)}
      onFailure={(res) => console.error(res)}
      clientId={process.env.GOOGLE_CLIENT_ID}
      isSignedIn
    />
  );
};
