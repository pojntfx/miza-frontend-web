import * as React from "react";
import { TodoServiceLocal } from "./TodoServiceLocal";
import { container } from "tsyringe";

export interface ITodoViewProps {}

export const TodoView: React.FC<ITodoViewProps> = (props) => {
  const todoServiceLocal = container.resolve(TodoServiceLocal);

  todoServiceLocal.on("created", (todo) =>
    console.log(`Created ${todo.title}`)
  );

  return (
    <div {...props}>
      <button
        onClick={() => todoServiceLocal.createTodo(new Date().toLocaleString())}
      >
        Create Todo
      </button>
    </div>
  );
};
