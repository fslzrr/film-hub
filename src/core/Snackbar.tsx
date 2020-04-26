import React from "react";
import { useState } from "react";
import styles from "./Snackbar.module.scss";

type SnackbarType = {
  show: boolean;
  message: string;
  type: "Error" | "Success";
};

const Snackbar: React.FunctionComponent<SnackbarType> = (props) => {
  if (!props.show) return null;
  return (
    <div className={styles.Wrapper}>
      <div className={styles.Snackbar}>
        <div>{props.message}</div>
        <div className={styles.Btn}>Ok</div>
      </div>
    </div>
  );
};

export default Snackbar;
