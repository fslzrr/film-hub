import React from "react";
import styles from "./Poster.module.scss";
import RatingCell from "./RatingCell";
import ReadReviewCell from "./ReadReviewCell";

type PosterType = {
  poster_path: string;
  rating?: number;
  className?: string;
  onClick?: () => void;
};

const Poster: React.FunctionComponent<PosterType> = (props) => {
  return (
    <div
      className={`${styles.Poster} ${props.className}`}
      onClick={props.onClick ? props.onClick : () => {}}
    >
      <img
        src={`https://image.tmdb.org/t/p/w1280${props.poster_path}`}
        alt="Film Poster"
      ></img>
      {props.rating ? (
        <div className={styles.RatingCell}>
          <RatingCell rating={props.rating}></RatingCell>
        </div>
      ) : (
        <></>
      )}
      {props.onClick ? (
        <div className={styles.ReadReviewCell}>
          <ReadReviewCell></ReadReviewCell>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Poster;
