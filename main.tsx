import * as React from "react";
import * as ReactDOM from "react-dom";
import "reflect-metadata";
import { App } from "./local-connector-remote-approach/App";
import { container } from "tsyringe";
import { TodosServiceLocalImpl } from "./local-connector-remote-approach/services/local/todos";
import { TodosServiceConnectorImpl } from "./local-connector-remote-approach/services/connector/todos";
import { TodosServiceRemoteImpl } from "./local-connector-remote-approach/services/remote/todos";
// import { App } from "./neo-local-first/App";
// import App from "./src/components/App";
// import { App } from "./neo/App";

// ReactDOM.render(
//   <App
//     apiEndpoint={process.env.API_ENDPOINT}
//     googleClientId={process.env.GOOGLE_CLIENT_ID}
//   />,
//   document.getElementById("root")
// );

container.register("TodosServiceLocal", {
  useClass: TodosServiceLocalImpl,
});

container.register("TodosServiceConnector", {
  useClass: TodosServiceConnectorImpl,
});

container.register("TodosServiceRemote", {
  useClass: TodosServiceRemoteImpl,
});

ReactDOM.render(<App />, document.getElementById("root"));
