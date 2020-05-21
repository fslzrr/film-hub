import React from "react";
import styles from "./Button.module.scss";
import ThemeContext from "../theme/themeContext";

type ButtonType = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isSelected?: boolean;
  onClick: (event?: React.MouseEvent) => void;
};

const Button: React.FunctionComponent<ButtonType> = (props) => {
  return (
    <ThemeContext.Consumer>
      {({ themeClass, theme }) => (
        <button
          className={`${styles.Button} ${
            props.isSelected ? styles.SelectedButton : null
          } ${themeClass(styles, theme)} ${props.className}`}
          disabled={props.disabled}
          onClick={props.onClick}
        >
          {props.children}
        </button>
      )}
    </ThemeContext.Consumer>
  );
};

export default Button;
