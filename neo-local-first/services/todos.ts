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
  update: (todo: IRemoteTodo) => void;
}

export class RemoteTodosService implements IRemoteTodosService {
  private todos: IRemoteTodo[];
  private onCreated: (todo: IRemoteTodo) => void;
  private onDeleted: (todo: IRemoteTodo) => void;
  private onUpdated: (todo: IRemoteTodo) => void;

  constructor(
    onCreated: (todo: IRemoteTodo) => void,
    onDeleted: (todo: IRemoteTodo) => void,
    onUpdated: (todo: IRemoteTodo) => void
  ) {
    this.todos = [];
    this.onCreated = onCreated;
    this.onDeleted = onDeleted;
    this.onUpdated = onUpdated;

    setInterval(
      () =>
        this.create({
          title: new Date().toLocaleDateString() + "from remote",
          body: new Date().toLocaleTimeString(),
        }),
      1000
    );

    setInterval(() => {
      this.delete(this.todos[this.todos.length - 1]);
    }, 2000);

    setInterval(() => {
      this.update({
        ...this.todos[0],
        title: new Date().toLocaleString() + "from service",
      });
    }, 3000);
  }

  create(todo: IRemoteNewTodo) {
    console.log("Remote todos:", this.todos.length);

    const newTodo = { ...todo, id: new Date().getTime() };

    this.todos.push(newTodo);

    setTimeout(() => this.onCreated(newTodo), 0);

    return newTodo;
  }

  delete(todo: IRemoteTodo) {
    this.todos = this.todos.filter((t) => t.id != todo.id);

    setTimeout(() => this.onDeleted(todo), 0);
  }

  update(todo: IRemoteTodo) {
    const todoToUpdate = this.todos.find((t) => t.id == todo.id);

    if (todo.title) todoToUpdate.title = todo.title;
    if (todo.body) todoToUpdate.body = todo.body;

    this.todos = this.todos.map((t) =>
      t.id == todoToUpdate.id ? todoToUpdate : t
    );

    setTimeout(() => this.onUpdated(todoToUpdate), 0);
  }
}
