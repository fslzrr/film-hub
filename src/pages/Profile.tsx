import React, { useState, useEffect } from "react";
import { PageType } from "../App";
import PageContainer from "../core/PageContainer";
import styles from "./Profile.module.scss";
import Header from "../core/Header";
import Icon from "../common/Icon";
import { faChevronLeft, faCog } from "@fortawesome/free-solid-svg-icons";
import { functions } from "../config/firebase";
import User, { Follow } from "../types/user";
import { ListItem } from "../types/listItem";
import TabBarSecondary from "../core/TabBarSecondary";
import ProfilePicture from "../components/ProfilePicture";
import Poster from "../components/Poster";
import { PageOptions } from "../App";
import Button from "../core/Button";
import { CSSTransition } from "react-transition-group";
import ReviewModal from "../components/ReviewModal";
import Feedback from "../types/Feedback";

type TabType = {
  listItems: ListItem[];
  feedbacks: Feedback[];
  showModal: (id: number, type: string) => void;
};

function getFeedback(feedbacks: Feedback[], id: number) {
  const feedback = feedbacks.filter((x) => x.id === id);
  if (feedback.length === 0) return undefined;
  if (feedback.length > 0) {
    const sorted = feedback.sort((a, b) => b.season! - a.season!);
    return sorted[0];
  }
  return feedback[0];
}

const Tab: React.FunctionComponent<TabType> = (props) => {
  return (
    <div className={styles.Tab}>
      {props.listItems.map((listItem) => {
        const feedback = getFeedback(props.feedbacks, listItem.id);
        return (
          <div
            key={listItem.id}
            className={styles.ContentItem}
            onClick={() => props.showModal(listItem.id, listItem.type)}
          >
            <Poster
              poster_path={listItem.poster_path}
              rating={feedback ? feedback.rating : undefined}
            ></Poster>
          </div>
        );
      })}
    </div>
  );
};

async function handleFollowPromise(follow: Follow, followed: boolean) {
  const handleFollowFunc = functions.httpsCallable("handleFollow");
  const response = await handleFollowFunc({ follow, followed });
  return response.data;
}

const Profile: React.FunctionComponent<PageType> = (props) => {
  const [user, updateUser] = useState<User | undefined>();
  const [following, updateFollowing] = useState(false);
  const [watched, updateWatched] = useState<ListItem[]>([]);
  const [toWatch, updateToWatch] = useState<ListItem[]>([]);
  const [favorites, updateFavorites] = useState<ListItem[]>([]);
  const [feedbacks, updateFeedbacks] = useState<Feedback[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Feedback>();

  const headersAttributes = props.attributes?.userUID
    ? {
        title: "Profile",
        iconLeft: <Icon>{faChevronLeft}</Icon>,
        actionLeft: () => props.back!(),
      }
    : {
        title: "Profile",
        iconRight: <Icon>{faCog}</Icon>,
        actionRight: () => props.to("Settings"),
      };

  const handleContentClick = (id: number, type: string) => {
    setShowModal(true);
    const feedback = getFeedback(feedbacks, id);
    if (feedback) setSelectedContent(feedback);
    else {
      const to = type === "film" ? "FilmDetail" : "TVShowDetail";
      const attributes = type === "film" ? { filmID: id } : { tvShowID: id };
      props.to(to, attributes);
    }
  };

  const handleFollow = async (follow: Follow, followed: boolean) => {
    try {
      await handleFollowPromise(follow, followed);
      if (followed)
        updateUser({ ...user, followersCount: user?.followersCount! + 1 });
      else updateUser({ ...user, followersCount: user?.followersCount! - 1 });
      updateFollowing(!following);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const userUID = props.attributes?.userUID;
      const fetchProfileFunc = functions.httpsCallable("fetchProfile");
      const params = userUID ? { userUID } : {};
      const response = await fetchProfileFunc(params);

      updateUser(response.data.user);
      updateWatched(response.data.watched);
      updateToWatch(response.data.toWatch);
      updateFavorites(response.data.favorites);
      updateFeedbacks(response.data.feedbacks);
      updateFollowing(response.data.followed);

      if (localStorage.getItem("userUID") === response.data.user.uid) {
        localStorage.setItem("name", response.data.user.name);
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("image_url", response.data.user.image_url);
      }
    };

    fetchProfile();
  }, [props.attributes]);

  return (
    <PageContainer className={styles.MainBox}>
      <Header {...headersAttributes}></Header>
      <div className={styles.MainContainer}>
        <div className={styles.MainInfoContainer}>
          <ProfilePicture
            name={user?.name!}
            image_url={user?.image_url}
            canEdit={false}
          ></ProfilePicture>
          <div className={styles.Name}>{user?.name}</div>
          <div className={styles.Username}>{user?.username}</div>
        </div>
        <div className={styles.FollowsContainer}>
          <div
            className={styles.FollowsItem}
            onClick={() =>
              props.to("Followers", {
                userUID: user?.uid,
                title: "Following",
                watchingFollowers: false,
              })
            }
          >
            <div>Following</div>
            <div>{user?.followingCount}</div>
          </div>
          <div
            className={styles.FollowsItem}
            onClick={() =>
              props.to("Followers", {
                userUID: user?.uid,
                title: "Followers",
                watchingFollowers: true,
              })
            }
          >
            <div>Followers</div>
            <div>{user?.followersCount}</div>
          </div>
        </div>
        {props.attributes?.userUID ? (
          <div>
            <Button
              isSelected={following}
              className={styles.FollowBtn}
              onClick={() =>
                handleFollow(
                  {
                    userUID: user!.uid!,
                    username: user!.username!,
                    image_url: user!.image_url,
                  },
                  !following
                )
              }
            >
              {following ? "Unfollow" : "Follow"}
            </Button>
          </div>
        ) : null}
        <TabBarSecondary tabs={["To Watch", "Watched", "Favorites"]}>
          {[
            <Tab
              key={0}
              listItems={toWatch}
              feedbacks={feedbacks}
              showModal={handleContentClick}
            ></Tab>,
            <Tab
              key={1}
              listItems={watched}
              feedbacks={feedbacks}
              showModal={handleContentClick}
            ></Tab>,
            <Tab
              key={2}
              listItems={favorites}
              feedbacks={feedbacks}
              showModal={handleContentClick}
            ></Tab>,
          ]}
        </TabBarSecondary>
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
            setSelectedContent(undefined);
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
          to={() => {
            const type = selectedContent?.type;
            if (type === "film")
              props.to("FilmDetail", { filmID: selectedContent?.id });
            else props.to("TVShowDetail", { tvShowID: selectedContent?.id });
          }}
          onClose={() => {
            setShowModal(false);
            setSelectedContent(undefined);
          }}
          title={
            selectedContent
              ? selectedContent.type === "film"
                ? selectedContent.title
                : `${selectedContent.title} - Season ${selectedContent.season}`
              : ""
          }
          review={selectedContent ? selectedContent.review : ""}
          rating={selectedContent ? selectedContent.rating : -1}
          viewMode
        ></ReviewModal>
      </CSSTransition>
    </PageContainer>
  );
};

export default Profile;
