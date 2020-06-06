import React from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import styles from "./FeedItem.module.scss";
import Icon from "../common/Icon";
import Poster from "./Poster";

type FeedItemType = {
  imgURL: string;
  rating: number;
  label: string;
  onClick: () => void;
};

const FeedItem: React.FunctionComponent<FeedItemType> = (props) => {
  return (
    <div className={styles.FeedItem} onClick={() => props.onClick()}>
      <Poster
        className={styles.PosterContainer}
        poster_path={props.imgURL}
        rating={props.rating}
      ></Poster>
      <h3>{props.label}</h3>
      <Icon>{faChevronRight}</Icon>
    </div>
  );
};

export default FeedItem;
