import { createContext } from "react";

const ThemeContext = createContext({
  theme: "light",
  themeClass: (styles: { readonly [key: string]: string }, theme: string) =>
    `${styles[`theme-${theme}`]}`,
});

export default ThemeContext;
