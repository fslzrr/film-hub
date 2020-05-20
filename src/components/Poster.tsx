import React from "react";
import styles from "./Poster.module.scss";
import RatingCell from "./RatingCell";

type PosterType = {
  poster_path: string;
  rating?: number;
};

const Poster: React.FunctionComponent<PosterType> = (props) => {
  return (
    <div className={styles.Poster}>
      <img
        src={`https://image.tmdb.org/t/p/w1280${props.poster_path}`}
        alt="Film Poster"
      ></img>
      {props.rating ? (
        <div className={styles.RatingCell}>
          <RatingCell rating={10}></RatingCell>
        </div>
      ) : null}
    </div>
  );
};

export default Poster;
