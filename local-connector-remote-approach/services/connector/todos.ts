import { TodoLocal } from "../local/todos";
import { injectable, inject } from "tsyringe";
import { TodosServiceRemote, TodoRemote } from "../remote/todos";
import { EventEmitter } from "events";

export interface TodosServiceConnector extends EventEmitter {
  create(todo: TodoLocal): Promise<void>;
  delete(id: TodoLocal["id"]): Promise<void>;
  update(todo: TodoLocal): Promise<void>;
  reorder(id: TodoLocal["id"], offset: number): Promise<void>;
  on(event: "created", listener: (todo: TodoLocal) => void): this;
  on(event: "deleted", listener: (id: TodoLocal["id"]) => void): this;
  on(event: "updated", listener: (todo: TodoLocal) => void): this;
  setId(localId: TodoLocal["id"], remoteId: TodoRemote["id"]): Promise<void>;
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
      let matchingId = "";

      this.idmapper.forEach((remoteId, localId) => {
        if (todo.id == remoteId) {
          matchingId = localId;
        }
      });

      if (matchingId == "") {
        this.emit("created", { id: todo.id, title: todo.title });
      } else {
        this.emit("updated", { ...todo, id: matchingId });
      }
    });

    this.remote.on("deleted", async (id) => {
      let matchingId = "";

      this.idmapper.forEach((remoteId, localId) => {
        if (id == remoteId) {
          matchingId = localId;
        }
      });

      if (matchingId != "") {
        this.emit("deleted", matchingId);
      }
    });

    this.remote.on("updated", async (todo) => {
      let matchingId = "";

      this.idmapper.forEach((remoteId, localId) => {
        if (todo.id == remoteId) {
          matchingId = localId;
        }
      });

      if (matchingId != "") {
        this.emit("updated", { ...todo, id: matchingId });
      }
    });
  }

  async create(todo: TodoLocal) {
    this.idmapper.set(todo.id, todo.id);

    setTimeout(async () => {
      const remoteTodo = await this.remote.create(todo);

      this.idmapper.set(todo.id, remoteTodo.id);
    }, 500); // Mock latency of RPC
  }

  async delete(id: TodoLocal["id"]) {
    await this.waitUntilRemoteCreated(id);

    setTimeout(async () => {
      await this.remote.delete(this.idmapper.get(id));

      this.idmapper.delete(id);
    }, 500); // Mock latency of RPC
  }

  async update(todo: TodoLocal) {
    await this.waitUntilRemoteCreated(todo.id);

    setTimeout(
      async () =>
        await this.remote.update({ ...todo, id: this.idmapper.get(todo.id) }),
      500
    ); // Mock latency of RPC
  }

  async reorder(id: TodoLocal["id"], offset: number) {
    await this.waitUntilRemoteCreated(id);

    setTimeout(
      async () => await this.remote.reorder(this.idmapper.get(id), offset),
      500
    ); // Mock latency of RPC
  }

  async setId(localId: string, remoteId: string) {
    this.idmapper.set(localId, remoteId);
  }

  private async waitUntilRemoteCreated(id: TodoLocal["id"]) {
    while (this.idmapper.get(id) == id) {
      await new Promise((res) => setTimeout(() => res(), 500));
    }
  }
}
