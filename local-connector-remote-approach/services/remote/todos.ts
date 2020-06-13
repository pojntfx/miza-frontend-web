import { injectable } from "tsyringe";
import { EventEmitter } from "events";

export interface TodoRemoteNew {
  title: string;
}

export interface TodoRemote extends TodoRemoteNew {
  id: string;
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

  async create(todo: TodoRemoteNew) {
    const newTodo = { ...todo, id: new Date().getTime().toString() };

    this.todos.push(newTodo);

    console.log("Remote todos", this.todos);

    setTimeout(async () => this.emit("created", newTodo), 500); // Mock latency of message bus

    return newTodo;
  }

  async delete(id: TodoRemote["id"]) {
    const todoToDelete = this.todos.find((todo) => todo.id == id);

    this.todos = this.todos.filter((todo) => todo.id != todoToDelete.id);

    console.log("Remote todos", this.todos);

    setTimeout(async () => this.emit("deleted", todoToDelete.id), 500); // Mock latency of message bus
  }

  async update(todo: TodoRemote) {
    const todoToUpdate = this.todos.find((oldTodo) => oldTodo.id == todo.id);

    if (todo.title) todoToUpdate.title = todo.title;

    this.todos = this.todos.map((oldTodo) =>
      oldTodo.id == todoToUpdate.id ? todoToUpdate : oldTodo
    );

    setTimeout(async () => this.emit("updated", todoToUpdate), 500); // Mock latency of message bus
  }
}
