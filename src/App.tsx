import React, { useState } from "react";
import styles from "./App.module.scss";

function App() {
  const [theme, setTheme] = useState("dark");

  return (
    <div id="theme-root" className={`${styles[`theme-${theme}`]}`}>
      <div className={`${styles.App}`}>
        <section className={`${styles.Main}`}>
          <h2>This is the base from we will begin our project.</h2>
          <p>
            Go to <a href="#">this website</a> to learn more about what we are
            doing.
          </p>
          <section>
            <button onClick={() => setTheme("light")}>LightTheme</button>
            <button onClick={() => setTheme("dark")}>DarkTheme</button>
          </section>
        </section>
      </div>
    </div>
  );
}

export default App;
