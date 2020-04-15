import React, { useState } from "react";

import ThemeContext from "./theme/themeContext";
import styles from "./App.module.scss";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

type PageType = {
  to: (page: PageOptions) => void;
  toggleTheme: () => void;
};

const pages: { [key: string]: React.ComponentType<PageType> } = {
  Login,
  Signup,
  Home,
};

type PageOptions = "Login" | "Signup" | "Home";

const App: React.FunctionComponent<{}> = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [page, setPage] = useState<PageOptions>("Login");

  const themeClass = (
    styles: { readonly [key: string]: string },
    theme: string
  ) => `${styles[`theme-${theme}`]}`;

  const to = (page: PageOptions) => {
    setPage(page);
  };

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else setTheme("light");
  };

  const Page = pages[page];

  return (
    <ThemeContext.Provider value={{ theme, themeClass }}>
      <div className={`${styles.App} ${themeClass(styles, theme)}`}>
        <Page to={to} toggleTheme={toggleTheme}></Page>
      </div>
    </ThemeContext.Provider>
  );
};

export type { PageType };
export default App;
