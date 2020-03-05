import React, { useState, useEffect } from "react";
import * as Auth from "./helpers/auth";

import "./App.scss";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleInputs = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => setter(event.target.value);

  const signup = async () => {
    await Auth.signup(email, password);
    console.log("signed up");
  };

  const login = async () => {
    await Auth.login(email, password);
    console.log("logged in");
  };

  const logout = async () => {
    await Auth.logout();
    console.log("logged out");
  };

  useEffect(() => {}, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>email</p>
        <input
          value={email}
          onChange={event => handleInputs(event, setEmail)}
        ></input>
        <p>password</p>
        <input
          value={password}
          onChange={event => handleInputs(event, setPassword)}
        ></input>
        <button onClick={login}>login</button>
        <button onClick={signup}>signup</button>
        <button onClick={logout}>logout</button>
      </header>
    </div>
  );
}

export default App;
