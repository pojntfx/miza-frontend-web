import { EventEmitter } from "events";
import { v4 } from "uuid";
import { injectable, inject } from "tsyringe";
import { TodoAPI } from "./TodoAPI";

export interface ITodoRemote {
  id: string;
  title: string;
}

export declare interface TodoServiceRemote {
  on(event: "created", listener: (todo: ITodoRemote) => void): this;
}

@injectable()
export class TodoServiceRemote extends EventEmitter {
  constructor(@inject(TodoAPI) private api?: TodoAPI) {
    super();

    this.api.on("created", (todo) => this.emit("created", todo));
  }

  createTodo(title: string) {
    const newTodo = { id: v4(), title };

    this.api.createTodo(title);

    this.emit("created", newTodo);

    return newTodo;
  }
}
