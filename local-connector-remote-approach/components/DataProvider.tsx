import * as React from "react";
import { TodoLocal, TodosServiceLocal } from "../services/local/todos";
import { container } from "tsyringe";

export interface IDataProviderProps {
  apiUrl: string;
  token: string;
  children(props: IDataProviderChildrenProps): React.ReactElement;
}

export interface IDataProviderChildrenProps {
  loading: boolean;
  todos: TodoLocal[];
  createTodo: TodosServiceLocal["create"];
  deleteTodo: TodosServiceLocal["delete"];
  updateTodo: TodosServiceLocal["update"];
  reorderTodo: TodosServiceLocal["reorder"];
}

export const DataProvider: React.FC<IDataProviderProps> = ({
  apiUrl,
  token,
  children,
}) => {
  const [todos, setTodos] = React.useState<TodoLocal[]>([]);
  const [todosService, setTodosService] = React.useState<TodosServiceLocal>();

  React.useEffect(() => {
    const todosServiceLocal = container.resolve(
      "TodosServiceLocal"
    ) as TodosServiceLocal;

    todosServiceLocal.on("created", async (todo) =>
      setTodos((oldTodos) => [...oldTodos, todo])
    );

    todosServiceLocal.on("deleted", async (id) =>
      setTodos((oldTodos) => oldTodos.filter((todo) => todo.id != id))
    );

    todosServiceLocal.on("updated", async (todo) =>
      setTodos((oldTodos) =>
        oldTodos.map((oldTodo) => (oldTodo.id == todo.id ? todo : oldTodo))
      )
    );

    setTodosService(todosServiceLocal);
  }, []);

  return children({
    loading: !todosService,
    todos,
    createTodo: todosService && todosService.create.bind(todosService),
    deleteTodo: todosService && todosService.delete.bind(todosService),
    updateTodo: todosService && todosService.update.bind(todosService),
    reorderTodo: todosService && todosService.reorder.bind(todosService),
  });
};
