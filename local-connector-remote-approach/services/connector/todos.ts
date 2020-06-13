import { TodoLocal } from "../local/todos";
import { injectable, inject } from "tsyringe";
import { TodosServiceRemote, TodoRemote } from "../remote/todos";
import { EventEmitter } from "events";

export interface TodosServiceConnector extends EventEmitter {
  create(todo: TodoLocal): Promise<void>;
  delete(id: TodoLocal["id"]): Promise<void>;
  on(event: "created", listener: (todo: TodoLocal) => void): this;
  on(event: "deleted", listener: (id: TodoLocal["id"]) => void): this;
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

    this.remote.on("deleted", async (id) => {
      let exists = false;

      this.idmapper.forEach((externalId) => {
        if (id == externalId) {
          exists = true;
        }
      });

      if (exists) {
        this.emit("deleted", id);
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

  async delete(id: TodoLocal["id"]) {
    setTimeout(
      async () => await this.remote.delete(this.idmapper.get(id)),
      500
    ); // Mock latency of RPC
  }
}
