import React from "react";
import styles from "./CastAndCrewItem.module.scss";

const CastAndCrewItem: React.FunctionComponent<{
  name: string;
  role: string;
  profile_path: string | null;
}> = (props) => {
  const cleanStr = (str: string) => {
    if (str.includes("/")) return str.substring(0, str.indexOf("/"));
    return str;
  };

  return (
    <div className={styles.CastCrewItemContainer}>
      {props.profile_path ? (
        <img src={`https://image.tmdb.org/t/p/w500${props.profile_path}`}></img>
      ) : (
        EmptyProfilePic(props.name)
      )}
      <div className={styles.CastCrewName}>{props.name}</div>
      <div className={styles.CastCrewRole}> {cleanStr(props.role)}</div>
    </div>
  );
};

const EmptyProfilePic = (name: string) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .reduce((prev, curr) => `${prev}${curr[0]}`, "");
  return <div className={styles.EmptyProfilePic}>{initials}</div>;
};

export default CastAndCrewItem;
