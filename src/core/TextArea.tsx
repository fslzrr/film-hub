import React from "react";
import ThemeContext from "../theme/themeContext";
import styles from "./TextArea.module.scss";

type TextAreaType = {
  onChange?: (event: React.FormEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  className?: string;
  value: string | undefined;
  disabled?: boolean;
};

const TextArea: React.FunctionComponent<TextAreaType> = (props) => {
  return (
    <ThemeContext.Consumer>
      {({ themeClass, theme }) => (
        <textarea
          onChange={props.onChange}
          placeholder={props.placeholder}
          className={`${styles.TextArea} ${themeClass(styles, theme)} ${
            props.className
          }`}
          value={props.value}
          disabled={props.disabled}
        ></textarea>
      )}
    </ThemeContext.Consumer>
  );
};

export default TextArea;
