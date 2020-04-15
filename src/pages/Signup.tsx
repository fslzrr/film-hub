import React from "react";
import { PageType } from "../App";
import Header from "../core/Header";
import PageContainer from "../core/PageContainer";
import Button from "../core/Button";

const Signup: React.FunctionComponent<PageType> = (props) => {
  return (
    <PageContainer>
      <Header title="Create a New Account"></Header>
      <p>Signup page</p>
      <p>...</p>

      <p>Already have an account?</p>
      <p>
        <br></br>
      </p>
      <Button onClick={() => props.to("Login")}>Login</Button>
    </PageContainer>
  );
};

export default Signup;
