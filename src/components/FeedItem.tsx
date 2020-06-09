import React from "react";
import moment from "moment";
import styles from "./FeedItem.module.scss";
import Poster from "./Poster";
import Feed from "../types/Feed";
import { PageOptions } from "../pages/Home";

type FeedItemType = {
  to: (page: PageOptions, attributes?: any) => void;
  entry: Feed;
  onClick: () => void;
};

function getTimePassed(createdDate: string): string {
  const createdMoment = moment(createdDate);
  const nowMoment = moment();
  const daysPassed = nowMoment.diff(createdMoment, "days");
  if (0 < daysPassed) return `${daysPassed}d`;
  const hoursPassed = nowMoment.diff(createdMoment, "hours");
  if (0 < hoursPassed && hoursPassed <= 24) return `${hoursPassed}h`;
  const minutesPassed = nowMoment.diff(createdMoment, "minutes");
  if (0 < minutesPassed && minutesPassed <= 60) return `${minutesPassed}m`;
  const secondsPassed = nowMoment.diff(createdMoment, "seconds");
  return `${secondsPassed}s`;
}

const FeedItem: React.FunctionComponent<FeedItemType> = (props) => {
  const {
    userUID,
    username,
    createdAt,
    type,
    title,
    season,
    posterPath,
    rating,
  } = props.entry;
  const timePassed = getTimePassed(moment(createdAt._seconds, "X").format());

  return (
    <div className={styles.FeedItem}>
      <div
        className={styles.ItemHeader}
        onClick={() => props.to("Profile", { userUID })}
      >
        <div>
          <h3>{username}</h3>
          <p>{timePassed}</p>
        </div>
        {type === "film" ? (
          <p>
            Added a feedback on <b>{title}</b>.
          </p>
        ) : (
          <p>
            Added feedback on{" "}
            <b>
              {title} Season {season}
            </b>
            .
          </p>
        )}
      </div>
      <Poster
        className={styles.PosterContainer}
        rating={rating}
        poster_path={posterPath}
        onClick={props.onClick}
      ></Poster>
    </div>
  );
};

export default FeedItem;
