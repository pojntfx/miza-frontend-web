export interface IRemoteTodo extends IRemoteNewTodo {
  id: string | number;
}

export interface IRemoteNewTodo {
  title: string;
  body: string;
}

export interface IRemoteTodosService {
  create: (todo: IRemoteNewTodo) => IRemoteTodo;
}

export class RemoteTodosService implements IRemoteTodosService {
  private todos: IRemoteTodo[];
  private onCreated: (todo: IRemoteTodo) => void;

  constructor(onCreated: (todo: IRemoteTodo) => void) {
    this.todos = [];
    this.onCreated = onCreated;

    setInterval(
      () =>
        this.onCreated({
          id: new Date().getTime(),
          title: new Date().toLocaleDateString(),
          body: new Date().toLocaleTimeString(),
        }),
      1000
    );
  }

  create(todo: IRemoteNewTodo) {
    const newTodo = { ...todo, id: new Date().getTime() };

    this.todos.push(newTodo);

    setTimeout(() => this.onCreated(newTodo), 0);

    return newTodo;
  }
}