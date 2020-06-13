import { TodoLocal } from "../local/todos";
import { injectable, inject } from "tsyringe";
import { TodosServiceRemote, TodoRemote } from "../remote/todos";
import { EventEmitter } from "events";

export interface TodosServiceConnector extends EventEmitter {
  create(todo: TodoLocal): Promise<void>;
  on(event: "created", listener: (todo: TodoLocal) => void): this;
}

@injectable()
export class TodosServiceConnectorImpl extends EventEmitter
  implements TodosServiceConnector {
  private idmapper = new Map<string, string>();

  constructor(
    @inject("TodosServiceRemote") private remote?: TodosServiceRemote
  ) {
    super();

    this.remote.on("created", async (todo) => {
      let exists = false;

      this.idmapper.forEach((externalId) => {
        if (todo.id == externalId) {
          exists = true;
        }
      });

      if (!exists) {
        this.emit("created", { id: todo.id, title: todo.title });
      }
    });
  }

  async create(todo: TodoLocal) {
    this.idmapper.set(todo.id, todo.id);

    setTimeout(async () => {
      const remoteTodo = await this.remote.create({ title: todo.title });

      this.idmapper.set(todo.id, remoteTodo.id);
    }, 500); // Mock latency of RPC
  }
}
