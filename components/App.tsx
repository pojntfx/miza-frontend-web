import * as React from "react";
import "typeface-roboto";
import Button from "@material-ui/core/Button";

export default (props: any) => (
  <div {...props}>
    <Button variant="contained" color="primary">
      Hello, world!
    </Button>
  </div>
);
