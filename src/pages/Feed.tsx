import React, { useEffect, useState } from "react";
import { PageType } from "../App";
import Header from "../core/Header";
import PageContainer from "../core/PageContainer";
import { functions } from "../config/firebase";
import FeedItem from "../components/FeedItem";
import { CSSTransition } from "react-transition-group";
import ReviewModal from "../components/ReviewModal";
import styles from "./Feed.module.scss";
import FeedType from "../types/Feed";

async function loadFeedPromise() {
  const loadFeedFunc = functions.httpsCallable("loadFeed");
  const response = await loadFeedFunc();
  return response.data as FeedType[];
}

function getDisplayText(
  title: string,
  type: string,
  username: string,
  season?: number
) {
  if (type === "film") return `${username} posted feedback of ${title}.`;
  return `${username} posted feedback of season ${season} of ${title}.`;
}

const Feed: React.FunctionComponent<PageType> = (props) => {
  const [feed, setFeed] = useState<FeedType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedEntry, setSelectedFeedEntry] = useState<any>();
  const loadFeed = async () => {
    try {
      const data = await loadFeedPromise();
      setFeed(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // loadFeed();
  }, []);

  return (
    <PageContainer>
      <Header title="FilmHub"></Header>
      <div>
        {feed.map((entry, index) => (
          <FeedItem
            key={index}
            label={getDisplayText(
              entry.title,
              entry.type,
              entry.username,
              entry.season
            )}
            imgURL={`${entry.posterPath}`}
            rating={entry.rating}
            onClick={() => {
              setSelectedFeedEntry(entry);
              setShowModal(true);
            }}
          ></FeedItem>
        ))}
      </div>

      {/* Review Modal and Transitions */}
      <CSSTransition
        in={showModal}
        unmountOnExit
        timeout={300}
        classNames="background"
      >
        <div
          className={styles.ReviewModal}
          onClick={() => {
            setShowModal(false);
            setSelectedFeedEntry(undefined);
          }}
        ></div>
      </CSSTransition>

      <CSSTransition
        in={showModal}
        unmountOnExit
        timeout={300}
        classNames="review-modal"
      >
        <ReviewModal
          onClose={() => {
            setShowModal(false);
            setSelectedFeedEntry(undefined);
          }}
          title={selectedFeedEntry ? selectedFeedEntry.title : ""}
          review={selectedFeedEntry ? selectedFeedEntry.review : ""}
          rating={selectedFeedEntry ? selectedFeedEntry.rating : -1}
          viewMode
        ></ReviewModal>
      </CSSTransition>
    </PageContainer>
  );
};

export default Feed;
