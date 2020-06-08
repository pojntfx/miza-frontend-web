export interface IRemoteTodo extends IRemoteNewTodo {
  id: string | number;
}

export interface IRemoteNewTodo {
  title: string;
  body: string;
}

export interface IRemoteTodosService {
  create: (todo: IRemoteNewTodo) => IRemoteTodo;
  delete: (todo: IRemoteTodo) => void;
}

export class RemoteTodosService implements IRemoteTodosService {
  private todos: IRemoteTodo[];
  private onCreated: (todo: IRemoteTodo) => void;
  private onDeleted: (todo: IRemoteTodo) => void;

  constructor(
    onCreated: (todo: IRemoteTodo) => void,
    onDeleted: (todo: IRemoteTodo) => void
  ) {
    this.todos = [];
    this.onCreated = onCreated;
    this.onDeleted = onDeleted;

    setInterval(
      () =>
        this.create({
          title: new Date().toLocaleDateString(),
          body: new Date().toLocaleTimeString(),
        }),
      1000
    );

    setInterval(() => {
      this.delete(this.todos[this.todos.length - 1]);
    }, 2000);
  }

  create(todo: IRemoteNewTodo) {
    const newTodo = { ...todo, id: new Date().getTime() };

    this.todos.push(newTodo);

    setTimeout(() => this.onCreated(newTodo), 0);

    return newTodo;
  }

  delete(todo: IRemoteTodo) {
    this.todos = this.todos.filter((t) => t.id != todo.id);

    setTimeout(() => this.onDeleted(todo), 0);
  }
}
