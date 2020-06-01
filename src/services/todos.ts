export interface ITodo {
  id: number;
  title: string;
  body: string;
  index: number;
}

interface ILocalTodosService {
  create: (
    id: ITodo["id"],
    title: ITodo["title"],
    body: ITodo["body"],
    index: ITodo["index"]
  ) => ITodo;
  list: () => ITodo[];
  update: (
    id: ITodo["id"],
    title: ITodo["title"],
    body: ITodo["body"],
    index: ITodo["index"]
  ) => ITodo;
  delete: (id: ITodo["id"]) => ITodo;
  reorder: (id: ITodo["id"], offset: number) => ITodo;
}

export class LocalTodosService implements ILocalTodosService {
  private todos: ITodo[];

  constructor() {
    this.todos = [];
  }

  create(
    id: ITodo["id"],
    title: ITodo["title"],
    body: ITodo["body"],
    index: ITodo["index"]
  ) {
    const todo = { id, title, body, index };

    this.todos.push(todo);

    return todo;
  }

  list() {
    return this.todos;
  }

  update(
    id: ITodo["id"],
    title: ITodo["title"],
    body: ITodo["body"],
    index: ITodo["index"]
  ) {
    const oldTodo = this.todos.find((t) => t.id == id);

    const newTodo = {
      ...oldTodo,
      id: id || oldTodo.id,
      title: title || oldTodo.title,
      body: body || oldTodo.body,
      index: index || oldTodo.index,
    };

    this.todos = this.todos.map((t) => (t.id == id ? newTodo : t));

    return newTodo;
  }

  delete(id: ITodo["id"]) {
    this.todos = this.todos.filter((t) => t.id != id);

    return this.todos.find((t) => t.id == id);
  }

  reorder(id: ITodo["id"], offset: number) {
    const oldTodo = this.todos.find((e) => e.id == id);
    const newIndex = oldTodo.index + offset;

    const updatedTodos = this.todos
      .filter((t) =>
        offset > 0
          ? t.index >= oldTodo.index && t.index <= newIndex
          : t.index <= oldTodo.index && t.index >= newIndex
      )
      .map((t) => ({ ...t, index: offset > 0 ? t.index - 1 : t.index + 1 }))
      .map((t) => (t.id == id ? { ...t, index: newIndex } : t));

    this.todos = this.todos.map(
      (t) => updatedTodos.find((u) => u.id == t.id) || t
    );

    return this.todos.find((t) => t.id == id);
  }
}
