import * as React from "react";
import { TodosServiceLocal, TodoLocal } from "../services/local/todos";
import { container } from "tsyringe";

export interface ITodoViewProps {}

export const TodoView: React.FC<ITodoViewProps> = (props) => {
  const [todos, setTodos] = React.useState<TodoLocal[]>([]);
  const [todosService, setTodosService] = React.useState<TodosServiceLocal>();

  React.useEffect(() => {
    const todosServiceLocal = container.resolve(
      "TodosServiceLocal"
    ) as TodosServiceLocal;

    todosServiceLocal.on("created", async (todo) =>
      setTodos((oldTodos) => [...oldTodos, todo])
    );

    setTodosService(todosServiceLocal);
  }, []);

  return (
    <div {...props}>
      <button
        onClick={() =>
          todosService.create({ title: new Date().toLocaleString() })
        }
      >
        Create todo
      </button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{JSON.stringify(todo)}</li>
        ))}
      </ul>
    </div>
  );
};
