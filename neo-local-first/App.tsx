import * as React from "react";
import { StoreProvider } from "easy-peasy";
import { todosStore } from "./stores/todos";
import { TodoListPage } from "./pages/TodoList";

export interface IAppProps {}

export const App: React.FC<IAppProps> = (props) => (
  <StoreProvider store={todosStore}>
    <TodoListPage />
  </StoreProvider>
);
