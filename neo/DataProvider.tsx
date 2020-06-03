import * as React from "react";
import { BrowserHeaders } from "browser-headers";
import { TodosClient } from "../src/proto/generated/src/proto/todos_pb_service";
import {
  Todo,
  TodoChangeType,
} from "../src/proto/generated/src/proto/todos_pb";

export interface IDataProviderProps {
  apiEndpoint: string;
  token: string;
  children: (data: IDataProviderDataProps) => React.ReactElement;
}

export interface IDataProviderDataProps {
  todos: ITodo[];
  createTodo: (todo: ITodo) => Promise<ITodo>;
}

export interface ITodo {
  id?: number | string;
  title: string;
  body: string;
  index?: number;
}

export const DataProvider: React.FC<IDataProviderProps> = ({
  apiEndpoint,
  token,
  children,
  ...otherProps
}) => {
  const [todos, setTodos] = React.useState<ITodo[]>();
  const [createTodo, setCreateTodo] = React.useState<
    (todo: ITodo) => Promise<ITodo>
  >();

  React.useEffect(() => {
    const headers = new BrowserHeaders({
      Authorization: `Bearer ${token}`,
    });

    const client = new TodosClient(apiEndpoint);

    client.list(new Todo(), headers, (e, res) =>
      e
        ? console.error(e)
        : setTodos(
            res.getTodosList().map((t) => ({
              id: t.getId(),
              title: t.getTitle(),
              body: t.getBody(),
              index: t.getIndex(),
            }))
          )
    );

    const stream = client.subscribeToChanges(new Todo(), headers);
    stream.on("data", (msg) => {
      const todoToProcess = msg.getTodo();

      switch (msg.getType()) {
        case TodoChangeType.CREATE:
          setTodos((oldTodos) => [
            ...oldTodos,
            {
              id: todoToProcess.getId(),
              title: todoToProcess.getTitle(),
              body: todoToProcess.getBody(),
              index: todoToProcess.getIndex(),
            },
          ]);

          break;
        case TodoChangeType.UPDATE:
          setTodos((oldTodos) =>
            oldTodos.map((t) =>
              t.id == todoToProcess.getId()
                ? {
                    id: todoToProcess.getId(),
                    title: todoToProcess.getTitle(),
                    body: todoToProcess.getBody(),
                    index: todoToProcess.getIndex(),
                  }
                : t
            )
          );

          break;
        case TodoChangeType.DELETE:
          setTodos((oldTodos) =>
            oldTodos.filter((t) => t.id != todoToProcess.getId())
          );

          break;
      }
    });

    setCreateTodo(() => (todo: ITodo) => {
      const newTodo = new Todo();
      newTodo.setTitle(todo.title);
      newTodo.setBody(todo.body);

      return new Promise<ITodo>((res) =>
        client.create(newTodo, headers, (e, createdTodo) =>
          e
            ? console.error(e)
            : res({
                id: createdTodo.getId(),
                title: createdTodo.getTitle(),
                body: createdTodo.getBody(),
                index: createdTodo.getIndex(),
              })
        )
      );
    });
  }, []);

  return <div {...otherProps}>{children({ todos, createTodo })}</div>;
};
