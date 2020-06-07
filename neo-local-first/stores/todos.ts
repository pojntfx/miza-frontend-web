import { ILocalTodo } from "../local-services/todos";
import { Action, createStore, action, actionOn, ActionOn } from "easy-peasy";
import { IRemoteTodo, IRemoteTodosService } from "../remote-services/todos";

export interface ITodosStore {
  todos: ILocalTodo[];
  idMappings: Map<ILocalTodo["id"], IRemoteTodo["id"]>;
  remoteTodosService: IRemoteTodosService;
  setRemoteTodoService: Action<ITodosStore, IRemoteTodosService>;
  createFromLocal: Action<ITodosStore, ILocalTodo>;
  onCreate: ActionOn<ITodosStore, ILocalTodo>;
  createFromRemote: Action<ITodosStore, IRemoteTodo>;
}

export const todosStore = createStore<ITodosStore>({
  todos: [],
  idMappings: new Map(),
  remoteTodosService: null,
  setRemoteTodoService: action((s, p) => {
    s.remoteTodosService = p;
  }),
  createFromLocal: action((s, p) => {
    s.todos.push(p);

    s.idMappings.set(p.id, p.id);
  }),
  onCreate: actionOn(
    (actions) => actions.createFromLocal,
    (s, { payload }) => {
      console.log("Calling remote and updating ID mappings", s, payload); // this has to finish first, use local ID in request here

      console.log("Old ID mappings", s.idMappings);

      const newTodo = s.remoteTodosService.create(payload);

      s.idMappings.set(payload.id, newTodo.id);

      console.log("New ID mappings", s.idMappings);
    }
  ),
  // all actions that are not "create" should ALWAYS use a dictionary lookup
  createFromRemote: action((s, p) => {
    console.log("ID mappings to work with", s.idMappings);

    let foundMatchingId = false;

    s.idMappings.forEach((mapping) => {
      if (mapping.valueOf() == p.id) foundMatchingId = true;
    });

    if (!foundMatchingId) {
      console.log("Creating from remote", s, p); // do nothing if local store already includes this ID, otherwise generate local ID and add

      s.todos.push(p);
    }
  }),
});
