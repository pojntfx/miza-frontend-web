import {
  Todo,
  NewTodo,
  TodoID,
  TodoReorder,
} from "../proto/generated/src/proto/todos_pb";
import { TodosClient } from "../proto/generated/src/proto/todos_pb_service";
import { BrowserHeaders } from "browser-headers";

interface IRemoteTodosService {
  create: (title: string, body: string) => Promise<Todo>;
  list: () => Promise<Todo[]>;
  update: (
    id: number,
    title: string,
    body: string,
    index: number
  ) => Promise<Todo>;
  delete: (id: number) => Promise<Todo>;
  reorder: (id: number, offset: number) => Promise<Todo>;
}

export class RemoteTodosService implements IRemoteTodosService {
  private client: TodosClient;
  private headers: BrowserHeaders;

  constructor(endpoint: string, token: string) {
    this.client = new TodosClient(endpoint);
    this.headers = new BrowserHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  create(title: string, body: string) {
    const todo = new NewTodo();
    todo.setTitle(title);
    todo.setBody(body);

    return new Promise<Todo>((res, rej) =>
      this.client.create(todo, this.headers, (e, resp) =>
        e ? rej(e) : res(resp)
      )
    );
  }

  list() {
    return new Promise<Todo[]>((res, rej) =>
      this.client.list(new Todo(), this.headers, (e, resp) =>
        e ? rej(e) : res(resp.getTodosList())
      )
    );
  }

  update(id: number, title: string, body: string) {
    const todo = new Todo();
    todo.setId(id);
    todo.setTitle(title);
    todo.setBody(body);

    return new Promise<Todo>((res, rej) =>
      this.client.update(todo, this.headers, (e, resp) =>
        e ? rej(e) : res(resp)
      )
    );
  }

  delete(id: number) {
    const todoID = new TodoID();
    todoID.setId(id);

    return new Promise<Todo>((res, rej) =>
      this.client.delete(todoID, this.headers, (e, resp) =>
        e ? rej(e) : res(resp)
      )
    );
  }

  reorder(id: number, offset: number) {
    const todoReorder = new TodoReorder();
    todoReorder.setId(id);
    todoReorder.setOffset(offset);

    return new Promise<Todo>((res, rej) =>
      this.client.reorder(todoReorder, this.headers, (e, resp) =>
        e ? rej(e) : res(resp)
      )
    );
  }
}
