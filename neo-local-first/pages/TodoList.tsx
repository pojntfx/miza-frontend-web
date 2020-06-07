import * as React from "react";
import { useStoreState, State, useStoreActions, Actions } from "easy-peasy";
import { ITodosStore } from "../stores/todos";
import { v4 } from "uuid";
import { RemoteTodosService } from "../services/todos";

export interface ITodoListPageProps {}

export const TodoListPage: React.FC<ITodoListPageProps> = (props) => {
  // Business logic
  const todos = useStoreState((state: State<ITodosStore>) => state.todos);
  const createTodo = useStoreActions(
    (actions: Actions<ITodosStore>) => actions.createTodo
  );

  // Sync logic
  const handleRemoteTodoCreate = useStoreActions(
    (actions: Actions<ITodosStore>) => actions.handleRemoteTodoCreate
  );
  const setRemoteTodoService = useStoreActions(
    (actions: Actions<ITodosStore>) => actions.setRemoteTodoService
  );
  React.useEffect(() => {
    setRemoteTodoService(
      new RemoteTodosService((todo) => handleRemoteTodoCreate(todo))
    );
  }, []);

  return (
    <div {...props}>
      <button
        onClick={() =>
          createTodo({ id: v4(), title: "asdf", body: "asdfasdfadsf" })
        }
      >
        Create Todo
      </button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{JSON.stringify(todo)}</li>
        ))}
      </ul>
    </div>
  );
};
