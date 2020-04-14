import React from "react";
import styles from "./Header.module.scss";
import ThemeContext from "../theme/themeContext";
import { IconProps } from "../common/Icon";

type HeaderType = {
  title: string;
  actionLeft?: (event?: React.MouseEvent) => void;
  iconLeft?: React.ComponentType<IconProps>;
  actionRight?: (event?: React.MouseEvent) => void;
  iconRight?: React.ComponentType<IconProps>;
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
          <h4>{props.title}</h4>
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
