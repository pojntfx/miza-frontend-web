import { Action, createStore, action, actionOn, ActionOn } from "easy-peasy";
import { IRemoteTodo, IRemoteTodosService } from "../services/todos";
import { v4 } from "uuid";

export interface ITodosStore {
  // Business logic
  todos: ILocalTodo[];
  createTodo: Action<ITodosStore, ILocalTodo>;
  deleteTodo: Action<ITodosStore, ILocalTodo>;

  // Sync logic
  setRemoteTodoService: Action<ITodosStore, IRemoteTodosService>;
  handleRemoteTodoCreate: Action<ITodosStore, IRemoteTodo>;
  handleRemoteTodoDelete: Action<ITodosStore, IRemoteTodo>;

  // Internal helpers
  idMappings: Map<ILocalTodo["id"], IRemoteTodo["id"]>;
  remoteTodosService: IRemoteTodosService;

  // Remote sync listeners
  onCreateTodo: ActionOn<ITodosStore, ILocalTodo>;
  onDeleteTodo: ActionOn<ITodosStore, ILocalTodo>;
}

export const todosStore = createStore<ITodosStore>({
  // Business logic
  todos: [],
  createTodo: action((s, p) => {
    s.todos.push(p);

    s.idMappings.set(p.id, p.id);
  }),
  deleteTodo: action((s, p) => {
    s.todos = s.todos.filter((t) => t.id != p.id);
  }),

  // Sync logic
  setRemoteTodoService: action((s, p) => {
    s.remoteTodosService = p;
  }),
  handleRemoteTodoCreate: action((s, p) => {
    let foundMatchingId = false;

    s.idMappings.forEach((value) => {
      if (value.valueOf() == p.id) foundMatchingId = true;
    });

    if (!foundMatchingId) {
      const localId = v4();

      s.idMappings.set(localId, p.id);

      s.todos.push({
        ...p,
        id: localId,
      });
    }
  }),
  handleRemoteTodoDelete: action((s, p) => {
    let matchingId = "";

    s.idMappings.forEach((value, key) => {
      if (value.valueOf() == p.id) matchingId = key.toString();
    });

    if (matchingId) s.todos = s.todos.filter((t) => t.id != matchingId);
  }),

  // Internal helpers
  idMappings: new Map(),
  remoteTodosService: null,

  // Remote sync listeners
  onCreateTodo: actionOn(
    (actions) => actions.createTodo,
    (s, { payload }) => {
      const newTodo = s.remoteTodosService.create(payload);

      s.idMappings.set(payload.id, newTodo.id);
    }
  ),
  onDeleteTodo: actionOn(
    (actions) => actions.deleteTodo,
    (s, { payload }) => {
      s.remoteTodosService.delete(payload);
    }
  ),
});

export interface ILocalTodo {
  id: string | number;
  title: string;
  body: string;
}
