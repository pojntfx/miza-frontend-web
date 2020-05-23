import * as React from "react";
import { TodosClient } from "../api/generated/api/todos_pb_service";
import { Todo, TodoID } from "../api/generated/api/todos_pb";
import { Box } from "rebass";
import { Loading } from "./App";
import { BrowserHeaders } from "browser-headers";

interface IUpdateTodoProps {
  client: TodosClient;
  id: number;
  token: string;
}

export default ({ client, id, token }: IUpdateTodoProps) => {
  const [todo, setTodo] = React.useState<Todo>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const todoID = new TodoID();
    todoID.setId(id);

    setLoading(true);

    client.get(
      todoID,
      new BrowserHeaders({
        Authorization: `Bearer ${token}`,
      }),
      (e, res) => {
        e ? console.error(e) : setTodo(res);

        setLoading(false);
      }
    );
  }, []);

  return (
    <Box>
      <Loading loading={loading} />
      {JSON.stringify(todo ? todo : "")}
    </Box>
  );
};
