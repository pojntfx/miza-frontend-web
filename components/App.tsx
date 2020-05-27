import * as React from "react";
import { TodosClient } from "../api/generated/api/todos_pb_service";
import { Todo, TodoID, NewTodo } from "../api/generated/api/todos_pb";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { ThemeProvider as ThemeUIThemeProvider, Theme } from "theme-ui";
import preset from "@rebass/preset";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { BrowserHeaders } from "browser-headers";
import { ListTodoPage } from "../pages/ListTodoPage";
import { GetTodoPage } from "../pages/GetTodoPage";
import { CreateTodoPage } from "../pages/CreateTodoPage";
import { UpdateTodoPage } from "../pages/UpdateTodoPage";

const theme = {
  ...preset,
  space: [0, 1, 2, 4, 8, 16, 32, 64, 128],
};

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
              path="/:id(\d+)/update"
              render={(props) => {
                const todo = todos.find(
                  (todo) => todo.getId() == props.match.params.id
                );

                return (
                  todo && (
                    <UpdateTodoPage
                      loading={loading}
                      id={todo.getId()}
                      title={todo.getTitle()}
                      body={todo.getBody()}
                      onSubmit={(id, title, body) => {
                        const todo = new Todo();
                        todo.setId(id);
                        todo.setTitle(title);
                        todo.setBody(body);

                        setLoading(true);

                        client.update(
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
                      backPath="/"
                    />
                  )
                );
              }}
            />
            <Route
              path="/:id(\d+)"
              render={(props) => {
                const todo = todos.find(
                  (todo) => todo.getId() == props.match.params.id
                );

                return (
                  todo && (
                    <GetTodoPage
                      id={todo.getId()}
                      title={todo.getTitle()}
                      body={todo.getBody()}
                      getPath={(id) => `/${id}/update`}
                      backPath="/"
                    />
                  )
                );
              }}
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
                  backPath="/"
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
                createPath="/create"
                getPath={(id) => `/${id}`}
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
