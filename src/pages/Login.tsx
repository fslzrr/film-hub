import React from "react";
import { PageType } from "../App";
import Header from "../core/Header";
import PageContainer from "../core/PageContainer";
import Button from "../core/Button";

const Login: React.FunctionComponent<PageType> = (props) => {
  return (
    <>
      <Header title="Welcome to FilmHub"></Header>
      <PageContainer>
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
        <Button onClick={() => props.to("Home")}>Home</Button>
      </PageContainer>
    </>
  );
};

export default Login;
