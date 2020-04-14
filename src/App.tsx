import React, { useState } from "react";

import ThemeContext from "./theme/themeContext";
import styles from "./App.module.scss";
import Header from "./core/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

type PageType = {
  to: (page: string, title?: string) => void;
  toggleTheme: () => void;
};

const pages: { [key: string]: React.ComponentType<PageType> } = {
  Login,
  Signup,
};

const titles: { [key: string]: string } = {
  Login: "Welcome to Film Hub",
  Signup: "Create a new account",
};

const App: React.FunctionComponent<{}> = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [page, setPage] = useState("Login");
  const [title, setTitle] = useState("Welcome to Film Hub");

  const themeClass = (
    styles: { readonly [key: string]: string },
    theme: string
  ) => `${styles[`theme-${theme}`]}`;

  const to = (page: string, title?: string) => {
    setPage(page);
    setTitle(title === undefined ? titles[page] : title);
  };

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else setTheme("light");
  };

  const Page = pages[page];

  return (
    <ThemeContext.Provider value={{ theme, themeClass }}>
      <div className={`${styles.App} ${themeClass(styles, theme)}`}>
        <Header title={title}></Header>
        <div className={styles.PageContainer}>
          <Page to={to} toggleTheme={toggleTheme}></Page>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export type { PageType };
export default App;
