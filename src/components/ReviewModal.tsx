import React, { useEffect } from "react";
import { useState } from "react";
import styles from "./ReviewModal.module.scss";
import Button from "../core/Button";
import ModalBox from "../core/ModalBox";
import TextArea from "../core/TextArea";

const ReviewModal: React.FunctionComponent<{
  filmTitle: string;
  review: string | undefined;
  rating: number | undefined;
  onClose: () => void;
  onSave: (rating: number, review: string) => void;
}> = (props) => {
  const [review, updateReview] = useState<string | undefined>(undefined);
  const [rating, updateRating] = useState<number | undefined>(undefined);

  useEffect(() => {
    updateReview(props.review);
    updateRating(props.rating);
  }, []);

  return (
    <ModalBox className={styles.ReviewBox}>
      <h2>{props.filmTitle}</h2>
      <TextArea
        onChange={(event) => updateReview(event.currentTarget.value)}
        placeholder={"Write your review here"}
        className={styles.TextArea}
        value={review}
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
                onClick={() => updateRating(10 - index)}
                key={10 - index}
              >
                {10 - index}
              </div>
            ))}
        </div>
      </div>
      <div className={styles.ReviewBoxButtons}>
        <Button onClick={() => props.onClose()}>Cancel</Button>
        <Button
          onClick={() => props.onSave(rating as number, review as string)}
        >
          Save
        </Button>
      </div>
    </ModalBox>
  );
};

export default ReviewModal;
