export interface IRemoteTodosService {
  create: (todo: IRemoteNewTodo) => IRemoteTodo;
  delete: (todo: IRemoteTodo) => void;
  update: (todo: IRemoteTodo) => void;
  reorder: (todo: IRemoteTodoReorder) => void;
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
      500
    );

    setInterval(() => {
      this.delete(this.todos[this.todos.length - 1]);
    }, 1000);

    setInterval(() => {
      this.update({
        ...this.todos[0],
        title: new Date().toLocaleString() + "from service",
      });
    }, 1500);

    setInterval(() => {
      this.reorder({
        ...this.todos[0],
        offset: 1,
      });
    }, 2000);
  }

  create(todo: IRemoteNewTodo) {
    console.log(
      "Remote todos:",
      this.todos.map((t) => t.index)
    );

    const newTodo = {
      ...todo,
      id: new Date().getTime(),
      index: this.todos.length + 1,
    };

    this.todos.push(newTodo);

    setTimeout(() => this.onCreated(newTodo), 0);

    return newTodo;
  }

  delete(todo: IRemoteTodo) {
    this.todos = this.todos.filter((t) => t.id != todo.id);

    setTimeout(() => this.onDeleted(todo), 0);

    // TODO: Recalculate indexes for todos with higher index and send updates
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

  reorder(todo: IRemoteTodoReorder) {
    const oldTodo = this.todos.find((e) => e.id == todo.id);
    const newIndex = oldTodo.index + todo.offset;

    const updatedTodos = this.todos
      .filter((t) =>
        todo.offset > 0
          ? t.index >= oldTodo.index && t.index <= newIndex
          : t.index <= oldTodo.index && t.index >= newIndex
      )
      .map((t) => ({
        ...t,
        index: todo.offset > 0 ? t.index - 1 : t.index + 1,
      }))
      .map((t) => (t.id == todo.id ? { ...t, index: newIndex } : t));

    this.todos = this.todos.map(
      (t) => updatedTodos.find((u) => u.id == t.id) || t
    );

    updatedTodos.forEach((t) => setTimeout(() => this.onUpdated(t), 0));
  }
}

export interface IRemoteTodo extends IRemoteNewTodo {
  id: string | number;
  index: number;
}

export interface IRemoteNewTodo {
  title: string;
  body: string;
}

export interface IRemoteTodoReorder extends IRemoteTodo {
  offset: number;
}
