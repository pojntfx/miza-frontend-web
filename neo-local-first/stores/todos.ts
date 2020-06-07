import { ILocalTodo } from "../local-services/todos";
import { Action, createStore, action, actionOn, ActionOn } from "easy-peasy";
import { IRemoteTodo, IRemoteTodosService } from "../remote-services/todos";
import { v4 } from "uuid";

export interface ITodosStore {
  // Business logic
  todos: ILocalTodo[];
  createTodo: Action<ITodosStore, ILocalTodo>;

  // Sync logic
  setRemoteTodoService: Action<ITodosStore, IRemoteTodosService>;
  handleRemoteTodoCreate: Action<ITodosStore, IRemoteTodo>;

  // Internal helpers
  idMappings: Map<ILocalTodo["id"], IRemoteTodo["id"]>;
  remoteTodosService: IRemoteTodosService;
  onCreateTodo: ActionOn<ITodosStore, ILocalTodo>;
}

export const todosStore = createStore<ITodosStore>({
  // Business logic
  todos: [],
  createTodo: action((s, p) => {
    s.todos.push(p);

    s.idMappings.set(p.id, p.id);
  }),

  // Sync logic
  setRemoteTodoService: action((s, p) => {
    s.remoteTodosService = p;
  }),
  handleRemoteTodoCreate: action((s, p) => {
    console.log("ID mappings to work with", s.idMappings);

    let foundMatchingId = false;

    s.idMappings.forEach((mapping) => {
      if (mapping.valueOf() == p.id) foundMatchingId = true;
    });

    if (!foundMatchingId) {
      console.log("Creating from remote", s, p); // do nothing if local store already includes this ID, otherwise generate local ID and add

      const localId = v4();

      s.idMappings.set(localId, p.id);

      s.todos.push({
        ...p,
        id: localId,
      });
    }
  }),

  // Internal helpers
  idMappings: new Map(),
  remoteTodosService: null,
  onCreateTodo: actionOn(
    (actions) => actions.createTodo,
    (s, { payload }) => {
      console.log("Calling remote and updating ID mappings", s, payload); // this has to finish first, use local ID in request here

      console.log("Old ID mappings", s.idMappings);

      const newTodo = s.remoteTodosService.create(payload);

      s.idMappings.set(payload.id, newTodo.id);

      console.log("New ID mappings", s.idMappings);
    }
  ),
  // all actions that are not "create" should ALWAYS use a dictionary lookup

  // all other remote action side effects now simply have to wait until the id's id mapper key no longer matches the value et voilà!
});
