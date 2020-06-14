import { injectable } from "tsyringe";
import { EventEmitter } from "events";

export interface TodoRemoteNew {
  title: string;
}

export interface TodoRemote extends TodoRemoteNew {
  id: string;
  index: number;
}

export interface TodosServiceRemote extends EventEmitter {
  create(todo: TodoRemoteNew): Promise<TodoRemote>;
  delete(id: TodoRemote["id"]): Promise<void>;
  update(todo: TodoRemote): Promise<void>;
  on(event: "created", listener: (todo: TodoRemote) => void): this;
  on(event: "deleted", listener: (id: TodoRemote["id"]) => void): this;
  on(event: "updated", listener: (todo: TodoRemote) => void): this;
}

@injectable()
export class TodosServiceRemoteImpl extends EventEmitter
  implements TodosServiceRemote {
  private todos: TodoRemote[] = [];

  constructor() {
    super();

    setInterval(
      async () =>
        await this.create({
          title: `Created from remote at ${new Date().toLocaleString()}`,
        }),
      250
    );

    setInterval(
      async () => await this.delete(this.todos[this.todos.length - 1].id),
      500
    );

    setInterval(
      async () =>
        await this.update({
          ...this.todos[this.todos.length - 1],
          title: `Updated from remote at ${new Date().toLocaleString()}`,
        }),
      750
    );
  }

  async create(todo: TodoRemoteNew) {
    const newTodo = {
      ...todo,
      id: new Date().getTime().toString(),
      index: this.todos.length + 1,
    };

    this.todos.push(newTodo);

    console.log("Remote todos", this.todos);

    setTimeout(async () => this.emit("created", newTodo), 500); // Mock latency of message bus

    // Send update events for todos which have been added in the meantime
    {
      this.todos
        .filter((t) => t.index >= newTodo.index)
        .forEach(
          (todoToUpdate) =>
            setTimeout(async () => this.emit("updated", todoToUpdate), 500) // Mock latency of message bus
        );
    }

    return newTodo;
  }

  async delete(id: TodoRemote["id"]) {
    const todoToDelete = this.todos.find((todo) => todo.id == id);

    this.todos = this.todos.filter((todo) => todo.id != todoToDelete.id);

    console.log("Remote todos", this.todos);

    setTimeout(async () => this.emit("deleted", todoToDelete.id), 500); // Mock latency of message bus

    // Recalculate indexes for todos with an index that is higher than the current one
    {
      const updatedTodos = this.todos
        .filter((t) => t.index >= todoToDelete.index)
        .map((t) => ({ ...t, index: t.index - 1 }));

      this.todos = this.todos.map(
        (t) => updatedTodos.find((u) => u.id == t.id) || t
      );

      updatedTodos.forEach(
        (todoToUpdate) =>
          setTimeout(async () => this.emit("updated", todoToUpdate), 500) // Mock latency of message bus
      );
    }
  }

  async update(todo: TodoRemote) {
    const todoToUpdate = this.todos.find((oldTodo) => oldTodo.id == todo.id);

    if (todoToUpdate) {
      if (todo.title) todoToUpdate.title = todo.title;

      this.todos = this.todos.map((oldTodo) =>
        oldTodo.id == todoToUpdate.id ? todoToUpdate : oldTodo
      );

      setTimeout(async () => this.emit("updated", todoToUpdate), 500); // Mock latency of message bus
    } else {
      throw new Error(
        `Todo ${todo.id} does not exist; it has probably been deleted in the time between you started the update request and now`
      );
    }
  }
}
