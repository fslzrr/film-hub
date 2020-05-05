import React from "react";
import ThemeContext from "../theme/themeContext";
import styles from "./ModalBox.module.scss";

type ModalBoxType = {
  className?: string;
  children: React.ReactNodeArray | React.ReactNode;
};

const ModalBox: React.FunctionComponent<ModalBoxType> = (props) => {
  return (
    <ThemeContext.Consumer>
      {({ themeClass, theme }) => (
        <div
          className={`${styles.ModalBox} ${themeClass(styles, theme)} ${
            props.className
          }`}
        >
          {props.children}
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export default ModalBox;
