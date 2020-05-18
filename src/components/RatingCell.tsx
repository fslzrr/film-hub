import React from "react";
import styles from "./RatingCell.module.scss";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Icon from "../common/Icon";

type RatingCellType = {
  rating: number;
  className?: String;
};

const RatingCell: React.FunctionComponent<RatingCellType> = (props) => {
  return (
    <div className={styles.RatingCell}>
      <div className={`${styles.Content} ${props.className}`}>
        <Icon>{faStar}</Icon>
        {props.rating}
      </div>
    </div>
  );
};

export default RatingCell;
