import * as React from "react";
import { DataProvider } from "./DataProvider";

export interface ITodoViewProps {}

export const TodoView: React.FC<ITodoViewProps> = (props) => (
  <DataProvider apiUrl="" token="">
    {({ loading, todos, createTodo, deleteTodo, updateTodo, reorderTodo }) => (
      <div {...props}>
        {loading && "Loading ..."}
        <button
          onClick={() =>
            createTodo({
              title: `Title created from view at ${new Date().toLocaleString()}`,
              body: `Body created from view at ${new Date().toLocaleString()}`,
            })
          }
        >
          Create todo
        </button>

        <button onClick={() => deleteTodo(todos[todos.length - 1].id)}>
          Delete last todo
        </button>

        <button
          onClick={() =>
            updateTodo({
              ...todos[todos.length - 1],
              title: `Title updated from view at ${new Date().toLocaleString()}`,
            })
          }
        >
          Update last todo
        </button>

        <button onClick={() => reorderTodo(todos[0].id, -1)}>
          Reorder first todo backwards
        </button>

        <button onClick={() => reorderTodo(todos[0].id, 1)}>
          Reorder first todo forwards
        </button>

        <div>Todo count: {todos.length}</div>

        <ul>
          {todos
            .sort((a, b) => a.index - b.index)
            .map((todo) => (
              <li key={todo.id}>{JSON.stringify(todo)}</li>
            ))}
        </ul>
      </div>
    )}
  </DataProvider>
);
