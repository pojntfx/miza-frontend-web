import { EventEmitter } from "events";
import { v4 } from "uuid";
import { injectable } from "tsyringe";

export interface ITodoAPI {
  id: string;
  title: string;
}

export declare interface TodoAPI {
  on(event: "created", listener: (todo: ITodoAPI) => void): this;
}

@injectable()
export class TodoAPI extends EventEmitter {
  private todos: ITodoAPI[];

  createTodo(title: string) {
    const newTodo = { id: v4(), title };

    this.todos.push(newTodo);

    this.emit("created", newTodo);

    return newTodo;
  }
}
