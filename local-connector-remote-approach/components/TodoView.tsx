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

  return (
    <div {...props}>
      <button
        onClick={() =>
          todosService.create({
            title: `Title created from view at ${new Date().toLocaleString()}`,
            body: `Body created from view at ${new Date().toLocaleString()}`,
          })
        }
      >
        Create todo
      </button>

      <button onClick={() => todosService.delete(todos[todos.length - 1].id)}>
        Delete last todo
      </button>

      <button
        onClick={() =>
          todosService.update({
            ...todos[todos.length - 1],
            title: `Title updated from view at ${new Date().toLocaleString()}`,
          })
        }
      >
        Update last todo
      </button>

      <button onClick={() => todosService.reorder(todos[0].id, -1)}>
        Reorder first todo backwards
      </button>

      <button onClick={() => todosService.reorder(todos[0].id, 1)}>
        Reorder first todo forwards
      </button>

      <div>Todo count: {todos.length}</div>

      <ul>
        {todos
          .sort((a, b) => a.index - b.index)
          .map((todo) => (
            <li key={todo.id}>{JSON.stringify(todo)}</li>
          ))}
      </ul>
    </div>
  );
};
