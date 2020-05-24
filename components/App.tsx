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
import { CreateTodoPage } from "../pages/CreateTodoPage";
import { SwipeActionWrapper } from "./SwipeActionWrapper";
import { TodoLink } from "./TodoLink";
import { AddNoteButton } from "./AddNoteButton";
import { ListTodoPage } from "../pages/ListTodoPage";

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
            <Route path="/create">
              {withRouter((props) => (
                <CreateTodoPage
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
              <ListTodoPage
                onDelete={(id) =>
                  deleteTodo(
                    id,
                    todos.find((todo) => todo.getId() == id).getTitle() ||
                      todos.find((todo) => todo.getId() == id).getBody()
                  )
                }
                onReorder={(id) => console.log(`Reordering ${id}`)}
                onSelect={(id) => console.log(`Selecting ${id}`)}
                todos={todos.map((todo) => ({
                  id: todo.getId(),
                  title: todo.getTitle(),
                  body: todo.getBody(),
                }))}
                loading={loading}
                createPath={() => "/create"}
                getPath={(id) => `/todos/${id}`}
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
