import { injectable } from "tsyringe";
import { v1 } from "uuid";

export interface TodoRemoteNew {
  title: string;
}

export interface TodoRemote extends TodoRemoteNew {
  id: string;
}

export interface TodosServiceRemote {
  create(todo: TodoRemoteNew): TodoRemote;
}

@injectable()
export class TodosServiceRemoteImpl implements TodosServiceRemote {
  private todos: TodoRemote[] = [];

  create(todo: TodoRemoteNew): TodoRemote {
    const newTodo = { ...todo, id: v1() };

    this.todos.push(newTodo);

    return newTodo;
  }
}
