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
  on(event: "created", listener: (todo: TodoRemote) => void): this;
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
}
