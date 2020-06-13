import { injectable, inject } from "tsyringe";
import { TodosServiceConnector } from "../connector/todos";
import { v4 } from "uuid";

export interface TodoLocalNew {
  title: string;
}

export interface TodoLocal extends TodoLocalNew {
  id: string;
}

export interface TodosServiceLocal {
  create(todo: TodoLocalNew): void;
}

@injectable()
export class TodosServiceLocalImpl implements TodosServiceLocal {
  private todos: TodoLocal[] = [];

  constructor(
    @inject("TodosServiceConnector") private connector?: TodosServiceConnector
  ) {}

  create(todo: TodoLocalNew) {
    const newTodo = { ...todo, id: v4() };

    this.todos.push(newTodo);

    this.connector.create(newTodo);
  }
}
