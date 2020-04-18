import React, { useState } from "react";
import { PageType } from "../App";
import PageContainer from "../core/PageContainer";
import Button from "../core/Button";
import Input from "../core/Input";
import { login } from "../helpers/auth";
import styles from "./Login.module.scss";

const Login: React.FunctionComponent<PageType> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signin = () => {
    login(email, password)
      .then(() => props.to("Home"))
      .catch((err) => console.error(err));
  };

  return (
    <PageContainer className={styles.MainBox}>
      {/* <Button onClick={props.toggleTheme}>Toggle Theme</Button> */}
      <div>
        <h1 className={styles.Header}>Welcome Back</h1>
      </div>
      <div className={styles.FormBox}>
        <Input
          placeholder="Email"
          onChange={(event) => setEmail(event.currentTarget.value)}
        ></Input>
        <Input
          placeholder="Password"
          onChange={(event) => setPassword(event.currentTarget.value)}
          type="password"
        ></Input>
        <Button onClick={() => signin()}>Login</Button>
      </div>
      <div className={styles.ButtonsBox}>
        <h2>Do not have an account?</h2>
        <Button onClick={() => props.to("Signup")}>Signup</Button>
      </div>
    </PageContainer>
  );
};

export default Login;
