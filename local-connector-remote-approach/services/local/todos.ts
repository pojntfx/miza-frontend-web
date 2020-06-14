import { injectable, inject } from "tsyringe";
import { TodosServiceConnector } from "../connector/todos";
import { v4 } from "uuid";
import { EventEmitter } from "events";

export interface TodoLocalNew {
  title: string;
}

export interface TodoLocal extends TodoLocalNew {
  id: string;
  index: number;
}

export interface TodosServiceLocal extends EventEmitter {
  create(todo: TodoLocalNew): Promise<void>;
  delete(id: TodoLocal["id"]): Promise<void>;
  update(todo: TodoLocal): Promise<void>;
  reorder(id: TodoLocal["id"], offset: number): Promise<void>;
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
    const todoToUpdate = await this.updateInternal({ ...todo, index: 0 }); // Don't overwrite the index, use reorder instead

    await this.connector.update(todoToUpdate);
  }

  async reorder(id: TodoLocal["id"], offset: number) {
    const todoReorder = await this.reorderInternal(id, offset); // Don't overwrite the index, use reorder instead

    await this.connector.reorder(todoReorder.id, todoReorder.offset);
  }

  private async createInternal(todo: TodoLocalNew, skipEmit?: boolean) {
    const newTodo = { ...todo, id: v4(), index: this.todos.length + 1 };

    this.todos.push(newTodo);

    !skipEmit && this.emit("created", newTodo);

    return newTodo;
  }

  private async deleteInternal(id: TodoLocal["id"]) {
    const todoToDelete = this.todos.find((todo) => todo.id == id);

    this.todos = this.todos.filter((todo) => todo.id != todoToDelete.id);

    this.emit("deleted", todoToDelete.id);

    // Recalculate indexes for todos with an index that is higher than the current one
    {
      const updatedTodos = this.todos
        .filter((t) => t.index >= todoToDelete.index)
        .map((t) => ({ ...t, index: t.index - 1 }));

      this.todos = this.todos.map(
        (t) => updatedTodos.find((u) => u.id == t.id) || t
      );

      updatedTodos.forEach((todoToUpdate) =>
        setTimeout(async () => this.emit("updated", todoToUpdate), 0)
      );
    }

    return todoToDelete;
  }

  private async updateInternal(todo: TodoLocal) {
    const todoToUpdate = this.todos.find((oldTodo) => oldTodo.id == todo.id);

    if (todoToUpdate) {
      if (todo.title) todoToUpdate.title = todo.title;
      if (todo.index) todoToUpdate.index = todo.index;

      this.todos = this.todos.map((oldTodo) =>
        oldTodo.id == todoToUpdate.id ? todoToUpdate : oldTodo
      );

      this.emit("updated", todoToUpdate);

      return todoToUpdate;
    } else {
      throw new Error(
        `Todo ${todo.id} does not exist; it has probably been deleted in the time between you started the update request and now`
      );
    }
  }

  private async reorderInternal(id: TodoLocal["id"], offset: number) {
    const todoToReorder = this.todos.find((e) => e.id == id);
    const newIndex = todoToReorder.index + offset;

    if (todoToReorder) {
      const updatedTodos = this.todos
        .filter((t) =>
          offset > 0
            ? t.index >= todoToReorder.index && t.index <= newIndex
            : t.index <= todoToReorder.index && t.index >= newIndex
        )
        .map((t) => ({
          ...t,
          index: offset > 0 ? t.index - 1 : t.index + 1,
        }))
        .map((t) => (t.id == id ? { ...t, index: newIndex } : t));

      this.todos = this.todos.map(
        (t) => updatedTodos.find((u) => u.id == t.id) || t
      );

      updatedTodos.forEach((todoToUpdate) =>
        setTimeout(async () => this.emit("updated", todoToUpdate), 0)
      );

      return { id, offset };
    } else {
      throw new Error(
        `Todo ${id} does not exist; it has probably been deleted in the time between you started the reorder request and now`
      );
    }
  }
}
