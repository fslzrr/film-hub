import React from "react";
import styles from "./Input.module.scss";
import ThemeContext from "../theme/themeContext";

type InputType = {
  placeholder: string;
  onChange?: (event: React.FormEvent<HTMLInputElement>) => void;
  type?: string;
  error?: boolean;
  errorMessage?: string;
};

const genericError = "Something wrong with the input.";

const Input: React.FunctionComponent<InputType> = (props) => {
  return (
    <ThemeContext.Consumer>
      {({ themeClass, theme }) => (
        <div className={`${styles.Wrapper} ${themeClass(styles, theme)}`}>
          <input
            onChange={props.onChange}
            placeholder={props.placeholder}
            type={props.type}
            className={`${styles.Input} ${themeClass(styles, theme)}`}
          ></input>
          {props.error ? (
            <p className={`${styles.P} ${themeClass(styles, theme)}`}>
              {props.errorMessage || genericError}
            </p>
          ) : (
            ""
          )}
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export default Input;
