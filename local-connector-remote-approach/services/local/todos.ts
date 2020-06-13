import { injectable, inject } from "tsyringe";
import { TodosServiceConnector } from "../connector/todos";
import { v4 } from "uuid";
import { EventEmitter } from "events";

export interface TodoLocalNew {
  title: string;
}

export interface TodoLocal extends TodoLocalNew {
  id: string;
}

export interface TodosServiceLocal extends EventEmitter {
  create(todo: TodoLocalNew): Promise<void>;
  on(event: "created", listener: (todo: TodoLocal) => void): this;
}

@injectable()
export class TodosServiceLocalImpl extends EventEmitter
  implements TodosServiceLocal {
  private todos: TodoLocal[] = [];

  constructor(
    @inject("TodosServiceConnector") private connector?: TodosServiceConnector
  ) {
    super();

    this.connector.on("created", async (todo) => {
      this.todos.push(todo);

      this.emit("created", todo);
    });
  }

  async create(todo: TodoLocalNew) {
    const newTodo = { ...todo, id: v4() };

    this.todos.push(newTodo);

    this.emit("created", newTodo);

    await this.connector.create(newTodo);
  }
}
