import { Action, createStore, action, actionOn, ActionOn } from "easy-peasy";
import { IRemoteTodo, IRemoteTodosService } from "../services/todos";
import { v4 } from "uuid";

export interface ITodosStore {
  // Business logic
  todos: ILocalTodo[];
  createTodo: Action<ITodosStore, ILocalTodo>;
  deleteTodo: Action<ITodosStore, ILocalTodo>;
  updateTodo: Action<ITodosStore, ILocalTodo>;

  // Sync logic
  setRemoteTodoService: Action<ITodosStore, IRemoteTodosService>;
  handleRemoteTodoCreate: Action<ITodosStore, IRemoteTodo>;
  handleRemoteTodoDelete: Action<ITodosStore, IRemoteTodo>;
  handleRemoteTodoUpdate: Action<ITodosStore, IRemoteTodo>;

  // Remote sync listeners
  onCreateTodo: ActionOn<ITodosStore, ILocalTodo>;
  onDeleteTodo: ActionOn<ITodosStore, ILocalTodo>;
  onUpdateTodo: ActionOn<ITodosStore, ILocalTodo>;

  // Internal helpers
  idMappings: Map<ILocalTodo["id"], IRemoteTodo["id"]>;
  remoteTodosService: IRemoteTodosService;
}

export const todosStore = createStore<ITodosStore>({
  // Business logic
  todos: [],
  createTodo: action((s, p) => {
    console.log("Local todos:", s.todos.length);

    s.todos.push(p);

    s.idMappings.set(p.id, p.id);
  }),
  deleteTodo: action((s, p) => {
    s.todos = s.todos.filter((t) => t.id != p.id);

    // TODO: Recalculate indexes for todos with higher index
  }),
  updateTodo: action((s, p) => {
    const todoToUpdate = s.todos.find((t) => t.id == p.id);

    if (p.title) todoToUpdate.title = p.title;
    if (p.body) todoToUpdate.body = p.body;

    s.todos = s.todos.map((t) => (t.id == todoToUpdate.id ? todoToUpdate : t));
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
  handleRemoteTodoUpdate: action((s, p) => {
    let matchingId = "";

    s.idMappings.forEach((value, key) => {
      if (value.valueOf() == p.id) matchingId = key.toString();
    });

    if (matchingId) {
      const todoToUpdate = s.todos.find((t) => t.id == matchingId);

      if (p.title) todoToUpdate.title = p.title;
      if (p.body) todoToUpdate.body = p.body;

      s.todos = s.todos.map((t) =>
        t.id == todoToUpdate.id ? todoToUpdate : t
      );
    }
  }),

  // Remote sync listeners
  onCreateTodo: actionOn(
    (actions) => actions.createTodo,
    (s, { payload }) => {
      const newTodo = s.remoteTodosService.create(payload);

      const todoToUpdate = s.todos.find((t) => t.id == payload.id);

      todoToUpdate.index = newTodo.index;

      s.todos = s.todos.map((t) =>
        t.id == todoToUpdate.id ? todoToUpdate : t
      );

      s.idMappings.set(payload.id, newTodo.id);
    }
  ),
  onDeleteTodo: actionOn(
    (actions) => actions.deleteTodo,
    (s, { payload }) => {
      // Wait until s.idMappings.get(payload.id) != payload.id
      s.remoteTodosService.delete({
        ...payload,
        id: s.idMappings.get(payload.id),
      });
    }
  ),
  onUpdateTodo: actionOn(
    (actions) => actions.updateTodo,
    (s, { payload }) => {
      // Wait until s.idMappings.get(payload.id) != payload.id
      s.remoteTodosService.update({
        ...payload,
        id: s.idMappings.get(payload.id),
      });
    }
  ),

  // Internal helpers
  idMappings: new Map(),
  remoteTodosService: null,
});

export interface ILocalTodo {
  id: string | number;
  title: string;
  body: string;
  index: number;
}
