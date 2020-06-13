import { EventEmitter } from "events";
import { TodoServiceConnector } from "./TodoServiceConnector";
import { inject, injectable } from "tsyringe";

export interface ITodoLocal {
  title: string;
}

export declare interface TodoServiceLocal {
  on(event: "created", listener: (todo: ITodoLocal) => void): this;
}

@injectable()
export class TodoServiceLocal extends EventEmitter {
  constructor(
    @inject(TodoServiceConnector) private api?: TodoServiceConnector
  ) {
    super();

    this.api.on("created", (todo) => this.emit("created", todo));
  }

  createTodo(title: string) {
    this.api.createTodo(title);

    this.emit("created", { title });
  }
}
