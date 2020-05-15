import * as React from "react";
import { TodosClient } from "../api/generated/api/todos_pb_service";
import { Todo } from "../api/generated/api/todos_pb";

export default () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);

  React.useEffect(() => {
    const client = new TodosClient("http://localhost:8080");

    client.list(new Todo(), {}, (e, res) => {
      setTodos(res.getTodosList());
    });
  }, []);

  return (
    <>
      <h1>Miza</h1>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>
            <div>{todo.getTitle()}</div>
            <div>{todo.getBody()}</div>
          </li>
        ))}
      </ul>
    </>
  );
};
