import React from "react";
import styles from "./Button.module.scss";
import ThemeContext from "../theme/themeContext";

type ButtonType = {
  children: React.ReactNode;
  onClick: (event?: React.MouseEvent) => void;
};

const Button: React.FunctionComponent<ButtonType> = (props) => {
  return (
    <ThemeContext.Consumer>
      {({ themeClass, theme }) => (
        <button
          className={`${styles.Button} ${themeClass(styles, theme)}`}
          onClick={props.onClick}
        >
          {props.children}
        </button>
      )}
    </ThemeContext.Consumer>
  );
};

export default Button;
