import React from "react";
import { PageType } from "../App";
import Button from "../core/Button";

const Login: React.FunctionComponent<PageType> = (props) => {
  return (
    <div>
      <Button onClick={props.toggleTheme}>Toggle Theme</Button>

      <p>
        <br></br>Login page
      </p>
      <p>...</p>

      <p>Don't have an account?</p>
      <p>
        <br></br>
      </p>
      <Button onClick={() => props.to("Signup")}>Signup</Button>
    </div>
  );
};

export default Login;
