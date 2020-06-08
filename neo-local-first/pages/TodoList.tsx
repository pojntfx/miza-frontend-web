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
  const deleteTodo = useStoreActions(
    (actions: Actions<ITodosStore>) => actions.deleteTodo
  );
  const updateTodo = useStoreActions(
    (actions: Actions<ITodosStore>) => actions.updateTodo
  );

  // Sync logic
  const handleRemoteTodoCreate = useStoreActions(
    (actions: Actions<ITodosStore>) => actions.handleRemoteTodoCreate
  );
  const handleRemoteTodoDelete = useStoreActions(
    (actions: Actions<ITodosStore>) => actions.handleRemoteTodoDelete
  );
  const handleRemoteTodoUpdate = useStoreActions(
    (actions: Actions<ITodosStore>) => actions.handleRemoteTodoUpdate
  );
  const setRemoteTodoService = useStoreActions(
    (actions: Actions<ITodosStore>) => actions.setRemoteTodoService
  );
  React.useEffect(() => {
    setRemoteTodoService(
      new RemoteTodosService(
        (todo) => handleRemoteTodoCreate(todo),
        (todo) => handleRemoteTodoDelete(todo),
        (todo) => handleRemoteTodoUpdate(todo)
      )
    );
  }, []);

  return (
    <div {...props}>
      <button
        onClick={() =>
          createTodo({
            id: v4(),
            title: "asdf",
            body: "asdfasdfadsf",
            index: todos.length + 1,
          })
        }
      >
        Create Todo
      </button>
      <button onClick={() => deleteTodo(todos[todos.length - 1])}>
        Delete last Todo
      </button>
      <button onClick={() => deleteTodo(todos[0])}>Delete first Todo</button>
      <button
        onClick={() =>
          updateTodo({
            ...todos[0],
            title: new Date().toLocaleString() + "from user",
          })
        }
      >
        Update first Todo
      </button>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>{JSON.stringify(todo)}</li>
        ))}
      </ul>
    </div>
  );
};
