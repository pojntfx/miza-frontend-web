import * as React from "react";
import {
  createStore,
  action,
  Action,
  StoreProvider,
  useStoreState,
  State,
  useStoreActions,
  Actions,
} from "easy-peasy";
import { v4 } from "uuid";

export interface IAppProps {}

export const App: React.FC<IAppProps> = (props) => (
  <StoreProvider store={todoStore} {...props}>
    <TodoPage />
  </StoreProvider>
);

export interface INewTodo {
  title: string;
  body: string;
}

export interface ITodo extends INewTodo {
  id: string | number;
}

export interface ITodoStore {
  todos: ITodo[];
  idMapper: Map<ITodo["id"], ITodo["id"]>;
  add: Action<ITodoStore, INewTodo>;
}

const todoStore = createStore<ITodoStore>({
  todos: [],
  idMapper: new Map(),
  add: action((s, p) => {
    const localId = v4();

    s.idMapper.set(localId, localId);

    s.todos.push({
      ...p,
      id: s.idMapper.get(localId),
    });
  }),
});

export interface ITodoPageProps {}

export const TodoPage: React.FC<ITodoStore> = (props) => {
  const todos = useStoreState((state: State<ITodoStore>) => state.todos);
  const add = useStoreActions((actions: Actions<ITodoStore>) => actions.add);
  const [newTodoTitle, setNewTodoTitle] = React.useState("");
  const [newTodoBody, setNewTodoBody] = React.useState("");

  return (
    <div {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          add({ title: newTodoTitle, body: newTodoBody });

          setNewTodoTitle("");
          setNewTodoBody("");
        }}
      >
        <label>
          Title:
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="New todo title"
            required
          />
        </label>

        <label>
          Body:
          <input
            type="text"
            value={newTodoBody}
            onChange={(e) => setNewTodoBody(e.target.value)}
            placeholder="New todo body"
            required
          />
        </label>

        <input type="submit" value="Submit" />
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <dl>
              <dt>ID</dt>
              <dd>{todo.id}</dd>
              <dt>Title</dt>
              <dd>{todo.title}</dd>
              <dt>Body</dt>
              <dd>{todo.body}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
};

export interface ILocalTodo {
    id: number
    title: string
}

export interface ILocalTodoService {
    create
}