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
        {({ todos, createTodo, updateTodo }) => (
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
              Update todo
            </button>
            {JSON.stringify(todos)}
          </>
        )}
      </DataProvider>
    )}
  </LoginProvider>
);
