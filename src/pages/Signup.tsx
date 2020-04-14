import React from "react";
import { PageType } from "../App";
import Button from "../core/Button";

const Signup: React.FunctionComponent<PageType> = (props) => {
  return (
    <div>
      <p>Signup page</p>
      <p>...</p>

      <p>Already have an account?</p>
      <p>
        <br></br>
      </p>
      <Button onClick={() => props.to("Login")}>Login</Button>
    </div>
  );
};

export default Signup;
