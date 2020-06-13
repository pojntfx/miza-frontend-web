import * as React from "react";
import { TodoView } from "./components/TodoView";

export interface IAppProps {}

export const App: React.FC<IAppProps> = (props) => <TodoView {...props} />;
