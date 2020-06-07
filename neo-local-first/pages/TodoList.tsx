import * as React from "react";
import { useStoreState, State, useStoreActions, Actions } from "easy-peasy";
import { ITodosStore } from "../stores/todos";
import { v4 } from "uuid";
import { RemoteTodosService } from "../remote-services/todos";

export interface ITodoListPageProps {}

export const TodoListPage: React.FC<ITodoListPageProps> = (props) => {
  const createFromRemote = useStoreActions(
    (actions: Actions<ITodosStore>) => actions.createFromRemote
  );
  const setRemoteTodoService = useStoreActions(
    (actions: Actions<ITodosStore>) => actions.setRemoteTodoService
  );

  React.useEffect(() => {
    const remoteTodoService = new RemoteTodosService((todo) =>
      createFromRemote(todo)
    );

    setRemoteTodoService(remoteTodoService);
  }, []);

  const todos = useStoreState((state: State<ITodosStore>) => state.todos);
  const create = useStoreActions(
    (actions: Actions<ITodosStore>) => actions.createFromLocal
  );

  return (
    <div {...props}>
      <button
        onClick={() =>
          create({ id: v4(), title: "asdf", body: "asdfasdfadsf" })
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
