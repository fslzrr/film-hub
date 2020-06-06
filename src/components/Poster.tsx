import React from "react";
import styles from "./Poster.module.scss";
import RatingCell from "./RatingCell";

type PosterType = {
  poster_path: string;
  rating?: number;
  className?: string;
};

const Poster: React.FunctionComponent<PosterType> = (props) => {
  return (
    <div className={`${styles.Poster} ${props.className}`}>
      <img
        src={`https://image.tmdb.org/t/p/w1280${props.poster_path}`}
        alt="Film Poster"
      ></img>
      {props.rating ? (
        <div className={styles.RatingCell}>
          <RatingCell rating={props.rating}></RatingCell>
        </div>
      ) : null}
    </div>
  );
};

export default Poster;
