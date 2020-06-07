import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./neo-local-first/App";
// import App from "./src/components/App";
// import { App } from "./neo/App";

// ReactDOM.render(
//   <App
//     apiEndpoint={process.env.API_ENDPOINT}
//     googleClientId={process.env.GOOGLE_CLIENT_ID}
//   />,
//   document.getElementById("root")
// );

ReactDOM.render(<App />, document.getElementById("root"));
