import React from "react";
import { useState } from "react";
import styles from "./ReviewModal.module.scss";
import Button from "../core/Button";
import ModalBox from "../core/ModalBox";
import TextArea from "../core/TextArea";
import Icon from "../common/Icon";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const ReviewModal: React.FunctionComponent<{
  title: string;
  review: string | undefined;
  rating: number | undefined;
  season?: number;
  viewMode?: boolean;
  onClose: () => void;
  onSave?: (rating: number, review: string) => void;
  to?: () => void;
  removeFromList?: (season?: number) => void;
}> = (props) => {
  const [review, updateReview] = useState<string | undefined>(props.review);
  const [rating, updateRating] = useState<number | undefined>(props.rating);

  return (
    <ModalBox className={styles.ReviewBox}>
      <div className={styles.TitleContainer}>
        <h2 onClick={() => (props.to ? props.to() : null)}>{props.title}</h2>
        {props.removeFromList ? (
          <div onClick={() => props.removeFromList!(props.season)}>
            <Icon>{faTrash}</Icon>
          </div>
        ) : null}
      </div>
      <TextArea
        onChange={(event) => updateReview(event.currentTarget.value)}
        placeholder={"Write your review here"}
        className={styles.TextArea}
        value={review}
        disabled={props.viewMode}
      ></TextArea>
      <div style={{ overflowX: "auto" }}>
        <div className={styles.RatingBox}>
          {Array(10)
            .fill(0, 0, 10)
            .map((num, index) => (
              <div
                className={styles.Rating}
                style={
                  rating === 10 - index
                    ? { background: "#304ffe", border: "1px solid #005cb2" }
                    : {}
                }
                onClick={() =>
                  !props.viewMode ? updateRating(10 - index) : null
                }
                key={10 - index}
              >
                {10 - index}
              </div>
            ))}
        </div>
      </div>
      <div
        className={
          props.viewMode
            ? styles.ReviewBoxButtonsView
            : styles.ReviewBoxButtonsEdit
        }
      >
        <Button onClick={() => props.onClose!()}>Cancel</Button>
        {!props.viewMode ? (
          <Button
            onClick={() => props.onSave!(rating as number, review as string)}
          >
            Save
          </Button>
        ) : null}
      </div>
    </ModalBox>
  );
};

export default ReviewModal;
