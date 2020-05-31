import * as React from "react";
import { TodosClient } from "../api/generated/api/todos_pb_service";
import {
  Todo,
  TodoID,
  NewTodo,
  TodoReorder,
} from "../api/generated/api/todos_pb";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { ThemeProvider as ThemeUIThemeProvider } from "theme-ui";
import preset from "@rebass/preset";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { BrowserHeaders } from "browser-headers";
import { ListTodoPage } from "../pages/ListTodoPage";
import { GetTodoPage } from "../pages/GetTodoPage";
import { CreateTodoPage } from "../pages/CreateTodoPage";
import { UpdateTodoPage } from "../pages/UpdateTodoPage";
import { LocalTodosService } from "../utils/localTodoService";

const theme = {
  ...preset,
  space: [0, 1, 2, 4, 8, 16, 32, 64, 128],
};

export default () => {
  const client = new TodosClient(process.env.API_ENDPOINT);
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [token, setToken] = React.useState("");
  const [selectMode, setSelectMode] = React.useState(false);
  const [selectedTodos, setSelectedTodos] = React.useState<number[]>([]);

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

  const deleteMultipleTodos = (ids: number[]) => {
    const shouldDelete = confirm(`Do you want to delete ${ids.length} todos?`);

    if (shouldDelete) {
      setLoading(true);

      Promise.all(
        ids.map((id) => {
          const todoID = new TodoID();
          todoID.setId(id);

          return new Promise((res) =>
            client.delete(
              todoID,
              new BrowserHeaders({
                Authorization: `Bearer ${token}`,
              }),
              (e) => {
                res(e && console.error(e));
              }
            )
          );
        })
      ).then(() => refreshTodos());
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
                onReorder={(id, oldIndex, newIndex) => {
                  if (newIndex == oldIndex) {
                    return;
                  }

                  const offset = -(newIndex - oldIndex); // We are rendering reversed

                  // Update locally
                  const localTodosService = new LocalTodosService();
                  todos.forEach((t) =>
                    localTodosService.create(
                      t.getId(),
                      t.getTitle(),
                      t.getBody(),
                      t.getIndex()
                    )
                  );

                  localTodosService.reorder(id, offset);

                  setTodos(
                    localTodosService.list().map((t) => {
                      const todo = new Todo();

                      todo.setId(t.id);
                      todo.setTitle(t.title);
                      todo.setBody(t.body);
                      todo.setIndex(t.index);

                      return todo;
                    })
                  );

                  // Update remotely
                  const todoReorder = new TodoReorder();
                  todoReorder.setId(id);
                  todoReorder.setOffset(offset);

                  setLoading(true);

                  client.reorder(
                    todoReorder,
                    new BrowserHeaders({
                      Authorization: `Bearer ${token}`,
                    }),
                    (e) => {
                      e && console.error(e);

                      refreshTodos();
                    }
                  );
                }}
                onSelect={(id) => {
                  if (selectedTodos.find((s) => s == id)) {
                    setSelectedTodos((s) => {
                      const newTodos = s.filter((t) => t != id);

                      newTodos.length < 1 && setSelectMode(false);

                      return newTodos;
                    });
                  } else {
                    setSelectedTodos((s) => [...s, id]);
                    setSelectMode(true);
                  }
                }}
                onDiscard={() => setSelectedTodos([])}
                onDeleteMultiple={(ids) => {
                  setSelectMode(false);
                  setSelectedTodos([]);

                  deleteMultipleTodos(ids);
                }}
                selectedTodos={selectedTodos}
                todos={todos
                  .map((todo) => ({
                    id: todo.getId(),
                    title: todo.getTitle(),
                    body: todo.getBody(),
                    index: todos.length - (todo.getIndex() - 1),
                  }))
                  .sort((a, b) => a.index - b.index)} // We are rendering reversed
                loading={loading}
                createPath="/create"
                getPath={(id) => `/${id}`}
                selectMode={selectMode}
                onToggleSelectMode={() => {
                  setSelectedTodos([]);
                  setSelectMode(!selectMode);
                }}
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
