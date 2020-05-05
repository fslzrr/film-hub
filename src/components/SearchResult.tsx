import React from "react";
import { faChevronRight, faImages } from "@fortawesome/free-solid-svg-icons";

import styles from "./SearchResult.module.scss";
import Icon from "../common/Icon";

type SearchResultType = {
  imgURL: string | undefined;
  label: string | undefined;
};

const SearchResult: React.FunctionComponent<SearchResultType> = (props) => {
  return (
    <div className={styles.SearchResult}>
      {props.imgURL ? (
        <img src={props.imgURL}></img>
      ) : (
        <div>
          <Icon>{faImages}</Icon>
        </div>
      )}
      <h3>{props.label}</h3>
      <Icon>{faChevronRight}</Icon>
    </div>
  );
};

export default SearchResult;
