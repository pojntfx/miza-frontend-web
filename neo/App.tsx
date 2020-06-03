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
        {({ todos }) => <>{JSON.stringify(todos)}</>}
      </DataProvider>
    )}
  </LoginProvider>
);
