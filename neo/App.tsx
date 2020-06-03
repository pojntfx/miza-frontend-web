import * as React from "react";
import { DataProvider } from "./DataProvider";
import { LoginProvider } from "./LoginProvider";

export interface IAppProps {
  apiEndpoint: string;
  googleClientId: string;
}

export const App: React.FC<IAppProps> = ({
  apiEndpoint,
  googleClientId,
  ...otherProps
}) => (
  <LoginProvider googleClientId={googleClientId}>
    {({ token }) => (
      <DataProvider apiEndpoint={apiEndpoint} token={token} {...otherProps}>
        {({
          loading,
          todos,
          createTodo,
          updateTodo,
          deleteTodo,
          reorderTodo,
        }) =>
          loading ? (
            <>Loading ...</>
          ) : (
            <>
              <button onClick={() => createTodo("Test title", "Test body")}>
                Create todo
              </button>
              <button
                onClick={() =>
                  updateTodo(
                    137,
                    "Test title " + Date.now(),
                    "Test body " + Date.now()
                  )
                }
              >
                Update todo 137
              </button>
              <button onClick={() => deleteTodo(todos[todos.length - 1].id)}>
                Delete last todo
              </button>
              <button onClick={() => reorderTodo(137, 1)}>
                Reorder todo 137 forwards
              </button>
              <button onClick={() => reorderTodo(137, -1)}>
                Reorder todo 137 backwards
              </button>
              {JSON.stringify(todos.sort((a, b) => a.index - b.index))}
            </>
          )
        }
      </DataProvider>
    )}
  </LoginProvider>
);
