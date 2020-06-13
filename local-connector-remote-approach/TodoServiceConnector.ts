import { EventEmitter } from "events";
import { ITodoLocal } from "./TodoServiceLocal";
import { TodoServiceRemote } from "./TodoServiceRemote";
import { inject, injectable } from "tsyringe";

export declare interface TodoServiceConnector {
  on(event: "created", listener: (todo: ITodoLocal) => void): this;
}

@injectable()
export class TodoServiceConnector extends EventEmitter {
  constructor(@inject(TodoServiceRemote) private api?: TodoServiceRemote) {
    super();

    this.api.on("created", (todo) => this.emit("created", todo));
  }

  createTodo(title: string) {
    this.api.createTodo(title);

    this.emit("created", { title });
  }
}
