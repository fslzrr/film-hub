import React from "react";
import styles from "./Header.module.scss";
import ThemeContext from "../theme/themeContext";

type HeaderType = {
  title: string;
  actionLeft?: (event?: React.MouseEvent) => void;
  iconLeft?: JSX.Element;
  actionRight?: (event?: React.MouseEvent) => void;
  iconRight?: JSX.Element;
};

const Header: React.FunctionComponent<HeaderType> = (props) => {
  return (
    <ThemeContext.Consumer>
      {({ themeClass, theme }) => (
        <div className={`${styles.Header} ${themeClass(styles, theme)}`}>
          <div
            className={styles.Action}
            onClick={props.actionLeft ? props.actionLeft : undefined}
          >
            {props.iconLeft !== undefined && props.iconLeft}
          </div>
          <h3>{props.title}</h3>
          <div
            className={styles.Action}
            onClick={props.actionRight ? props.actionRight : undefined}
          >
            {props.iconRight !== undefined && props.iconRight}
          </div>
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export default Header;
