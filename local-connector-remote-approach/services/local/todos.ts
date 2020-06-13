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
  delete(id: TodoLocal["id"]): Promise<void>;
  update(todo: TodoLocal): Promise<void>;
  on(event: "created", listener: (todo: TodoLocal) => void): this;
  on(event: "deleted", listener: (id: TodoLocal["id"]) => void): this;
  on(event: "updated", listener: (todo: TodoLocal) => void): this;
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
      const newTodo = await this.createInternal(todo, true);

      await this.connector.setId(newTodo.id, todo.id);

      this.emit("created", newTodo);
    });

    this.connector.on("deleted", async (id: TodoLocal["id"]) =>
      this.deleteInternal(id)
    );

    this.connector.on("updated", async (todo) => this.updateInternal(todo));
  }

  async create(todo: TodoLocalNew) {
    const newTodo = await this.createInternal(todo);

    await this.connector.create(newTodo);
  }

  async delete(id: TodoLocal["id"]) {
    const todoToDelete = await this.deleteInternal(id);

    await this.connector.delete(todoToDelete.id);
  }

  async update(todo: TodoLocal) {
    const todoToUpdate = await this.updateInternal(todo);

    await this.connector.update(todoToUpdate);
  }

  private async createInternal(todo: TodoLocalNew, skipEmit?: boolean) {
    const newTodo = { ...todo, id: v4() };

    this.todos.push(newTodo);

    !skipEmit && this.emit("created", newTodo);

    return newTodo;
  }

  private async deleteInternal(id: TodoLocal["id"]) {
    const todoToDelete = this.todos.find((todo) => todo.id == id);

    this.todos = this.todos.filter((todo) => todo.id != todoToDelete.id);

    this.emit("deleted", todoToDelete.id);

    return todoToDelete;
  }

  private async updateInternal(todo: TodoLocal) {
    const todoToUpdate = this.todos.find((oldTodo) => oldTodo.id == todo.id);

    if (todo.title) todoToUpdate.title = todo.title;

    this.todos = this.todos.map((oldTodo) =>
      oldTodo.id == todoToUpdate.id ? todoToUpdate : oldTodo
    );

    this.emit("updated", todoToUpdate);

    return todoToUpdate;
  }
}
