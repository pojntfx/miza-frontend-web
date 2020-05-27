import * as React from "react";

interface IGetTodoPageProps {
  title: string;
  body: string;
}

export const GetTodoPage: React.FC<IGetTodoPageProps> = ({
  title,
  body,
  ...otherProps
}) => <>{JSON.stringify({ title, body, ...otherProps })}</>;
