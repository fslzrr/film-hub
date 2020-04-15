import React from "react";
import styles from "./PageContainer.module.scss";

type PageContainerType = {
  children: React.ReactNodeArray | React.ReactNode;
  removedHeader?: boolean;
};

const PageContainer: React.FunctionComponent<PageContainerType> = (props) => {
  return (
    <div
      className={`${styles.PageContainer} ${
        props.removedHeader && styles.RemovedHeader
      }`}
    >
      {props.children}
    </div>
  );
};

export default PageContainer;
