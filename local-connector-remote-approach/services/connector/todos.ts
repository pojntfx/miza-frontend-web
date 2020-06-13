import { TodoLocal } from "../local/todos";
import { injectable, inject } from "tsyringe";
import { TodosServiceRemote } from "../remote/todos";

export interface TodosServiceConnector {
  create(todo: TodoLocal): void;
}

@injectable()
export class TodosServiceConnectorImpl implements TodosServiceConnector {
  private idmapper = new Map<string, string>();

  constructor(
    @inject("TodosServiceRemote") private remote?: TodosServiceRemote
  ) {}

  create(todo: TodoLocal): void {
    this.idmapper.set(todo.id, todo.id);

    setTimeout(() => {
      const remoteTodo = this.remote.create({ title: todo.title });

      this.idmapper.set(todo.id, remoteTodo.id);
    }, 100);
  }
}
