import React from "react";
import { PageType } from "../App";
import PageContainer from "../core/PageContainer";
import Button from "../core/Button";
import Input from "../core/Input";
import Header from "../core/Header";
import { functions } from "../config/firebase";
import { useState } from "react";
import styles from "./Signup.module.scss";
import User from "../types/user";
import Icon from "../common/Icon";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

async function signup(user: User) {
  try {
    const createUser = functions.httpsCallable("createUser");
    await createUser(user);
    console.log("User created successfully");
  } catch (error) {
    console.error(error);
  }
}

function isEverythingFilled(user: User): boolean {
  return Object.values(user).every((value) => value);
}

const Signup: React.FunctionComponent<PageType> = (props) => {
  const [user, setUser] = useState<User>({
    name: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
    username: undefined,
  });

  return (
    <PageContainer className={styles.MainBox}>
      <Header
        title=""
        iconLeft={<Icon>{faChevronLeft}</Icon>}
        actionLeft={() => props.to("Login")}
      ></Header>

      <div>
        <h1 className={styles.Header}>Create Account</h1>
      </div>

      <div className={styles.FormBox}>
        <Input
          placeholder="Username"
          onChange={(event) => {
            setUser({ ...user, username: event.currentTarget.value });
          }}
        ></Input>
        <Input
          placeholder="Name"
          onChange={(event) =>
            setUser({ ...user, name: event.currentTarget.value })
          }
        ></Input>
        <Input
          placeholder="Email"
          onChange={(event) =>
            setUser({ ...user, email: event.currentTarget.value })
          }
        ></Input>
        <Input
          placeholder="Password"
          onChange={(event) =>
            setUser({ ...user, password: event.currentTarget.value })
          }
          type="password"
        ></Input>
        <Input
          placeholder="Confirm Password"
          onChange={(event) =>
            setUser({ ...user, confirmPassword: event.currentTarget.value })
          }
          type="password"
          error={user.password !== user.confirmPassword}
          errorMessage={"Password mismatch"}
        ></Input>
      </div>

      <div className={styles.ButtonsBox}>
        <Button
          onClick={async () => {
            await signup(user);
            props.to("Login");
          }}
          disabled={!isEverythingFilled(user)}
        >
          Signup
        </Button>
      </div>
    </PageContainer>
  );
};

export default Signup;
