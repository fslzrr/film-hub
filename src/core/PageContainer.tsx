import React from "react";
import styles from "./PageContainer.module.scss";
import ThemeContext from "../theme/themeContext";

type PageContainerType = {
  children: React.ReactNodeArray | React.ReactNode;
};

const PageContainer: React.FunctionComponent<PageContainerType> = (props) => {
  return (
    <ThemeContext.Consumer>
      {({ themeClass, theme }) => (
        <div className={`${styles.PageContainer} ${themeClass(styles, theme)}`}>
          {props.children}
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export default PageContainer;
