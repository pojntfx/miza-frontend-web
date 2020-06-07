import { v4 } from "uuid";

export interface ILocalTodo extends ILocalNewTodo {
  id: string | number;
}

export interface ILocalNewTodo {
  title: string;
  body: string;
}

export interface ILocalTodosService {
  create: (todo: ILocalNewTodo) => void;
  setOnCreated: (onCreated: (todo: ILocalTodo) => void) => void;
}

export class LocalTodosService implements ILocalTodosService {
  private todos: ILocalTodo[];
  private onCreated: (todo: ILocalTodo) => void;

  constructor() {
    this.todos = [];
  }

  create(todo: ILocalNewTodo) {
    const newTodo = { ...todo, id: v4() };

    this.todos.push(newTodo);

    this.onCreated(newTodo);
  }

  setOnCreated(onCreated: (todo: ILocalTodo) => void) {
    this.onCreated = onCreated;
  }
}
