import * as React from "react";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { ThemeProvider as ThemeUIThemeProvider } from "theme-ui";
import preset from "@rebass/preset";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { ListTodoPage } from "../pages/ListTodoPage";
import { GetTodoPage } from "../pages/GetTodoPage";
import { CreateTodoPage } from "../pages/CreateTodoPage";
import { UpdateTodoPage } from "../pages/UpdateTodoPage";
import { LocalTodosService, ITodo } from "../services/todos";
import { RemoteTodosService } from "../api/todos";
import { TodosConverter } from "../converters/todos";

const theme = {
  ...preset,
  space: [0, 1, 2, 4, 8, 16, 32, 64, 128],
};

export default () => {
  const [todos, setTodos] = React.useState<ITodo[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [token, setToken] = React.useState("");
  const [selectMode, setSelectMode] = React.useState(false);
  const [selectedTodos, setSelectedTodos] = React.useState<number[]>([]);

  const [localTodosService, setLocalTodosService] = React.useState<
    LocalTodosService
  >();
  const [remoteTodosService, setRemoteTodosService] = React.useState<
    RemoteTodosService
  >();
  const todosConverter = new TodosConverter();

  const refreshTodos = () => {
    // Refresh remotely
    setLoading(true);
    remoteTodosService
      .list()
      .then((d) => {
        // Refresh locally
        localTodosService.readAll(d.map((t) => todosConverter.toInternal(t)));
        setTodos(localTodosService.list());
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  const deleteTodo = (id: number, title: string) => {
    const shouldDelete = confirm(`Do you want to delete todo ${title}?`);

    if (shouldDelete) {
      // Delete locally
      localTodosService.delete(id);
      setTodos(localTodosService.list());

      // Delete remotely
      setLoading(true);
      remoteTodosService
        .delete(id)
        .then(() => refreshTodos())
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  };

  const deleteMultipleTodos = (ids: number[]) => {
    const shouldDelete = confirm(`Do you want to delete ${ids.length} todos?`);

    if (shouldDelete) {
      // Delete locally
      ids.forEach((id) => localTodosService.delete(id));
      setTodos(localTodosService.list());

      // Delete remotely
      setLoading(true);
      Promise.all(ids.map((id) => remoteTodosService.delete(id)))
        .then(() => refreshTodos())
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  };

  const updateTodo = (
    id: number,
    title: string,
    body: string,
    afterLocalUpdate?: () => void
  ) => {
    // Update locally
    localTodosService.update(id, title, body);
    setTodos(localTodosService.list());

    afterLocalUpdate && afterLocalUpdate();

    // Update remotely
    setLoading(true);
    remoteTodosService
      .update(id, title, body)
      .then(() => refreshTodos())
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  const createTodo = (
    title: string,
    body: string,
    afterLocalUpdate?: () => void
  ) => {
    // Create locally
    localTodosService.create(title, body);
    setTodos(localTodosService.list());

    afterLocalUpdate && afterLocalUpdate();

    // Create remotely
    setLoading(true);
    remoteTodosService
      .create(title, body)
      .then(() => refreshTodos())
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  const reorderTodo = (id: number, oldIndex: number, newIndex: number) => {
    if (newIndex == oldIndex) {
      return;
    }

    const offset = -(newIndex - oldIndex); // We are rendering reversed

    // Reorder locally
    localTodosService.reorder(id, offset);
    setTodos(localTodosService.list());

    // Reorder remotely
    setLoading(true);
    remoteTodosService
      .reorder(id, offset)
      .then(() => refreshTodos())
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    if (token) {
      setLocalTodosService(new LocalTodosService());
      setRemoteTodosService(
        new RemoteTodosService(process.env.API_ENDPOINT, token)
      );
    }
  }, [token]);

  React.useEffect(() => remoteTodosService && refreshTodos(), [
    remoteTodosService,
  ]);

  return token ? (
    <StyledComponentsThemeProvider theme={theme}>
      <ThemeUIThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route
              path="/:id(\d+)/update"
              render={(props) => {
                const todo = todos.find(
                  (todo) => todo.id == props.match.params.id
                );

                return (
                  todo && (
                    <UpdateTodoPage
                      {...todo}
                      loading={loading}
                      onSubmit={(id, title, body) =>
                        updateTodo(id, title, body, () =>
                          props.history.push("/")
                        )
                      }
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
                  (todo) => todo.id == props.match.params.id
                );

                return (
                  todo && (
                    <GetTodoPage
                      {...todo}
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
                  onSubmit={(title, body) =>
                    createTodo(title, body, () => props.history.push("/"))
                  }
                  backPath="/"
                />
              ))}
            </Route>
            <Route path="/">
              <ListTodoPage
                onDelete={(id) =>
                  deleteTodo(
                    id,
                    todos.find((todo) => todo.id == id).title ||
                      todos.find((todo) => todo.id == id).body
                  )
                }
                onReorder={(id, oldIndex, newIndex) =>
                  reorderTodo(id, oldIndex, newIndex)
                }
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
                    ...todo,
                    index: todos.length - (todo.index - 1),
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
