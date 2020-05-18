import React, { useState, useEffect } from "react";
import { PageType } from "../App";
import PageContainer from "../core/PageContainer";
import styles from "./Profile.module.scss";
import Header from "../core/Header";
import Icon from "../common/Icon";
import { faChevronLeft, faCog } from "@fortawesome/free-solid-svg-icons";
import { functions } from "../config/firebase";
import User from "../types/user";
import { ListItem } from "../types/listItem";
import TabBarSecondary from "../core/TabBarSecondary";
import ProfilePicture from "../components/ProfilePicture";
import Poster from "../components/Poster";

type ContentItemType = {
  poster_path: string;
  to: () => void;
};

const ContentItem: React.FunctionComponent<ContentItemType> = (props) => {
  return (
    <div className={styles.ContentItem} onClick={props.to}>
      <Poster poster_path={props.poster_path} rating={10}></Poster>
    </div>
  );
};

type TabType = {
  contents: {
    type: string;
    poster_path: string;
    title: string;
    id: number;
  }[];
  to: () => void;
};

const Tab: React.FunctionComponent<TabType> = (props) => {
  return (
    <div className={styles.Tab}>
      {props.contents.map((content) => (
        <ContentItem
          key={content.id}
          poster_path={content.poster_path}
          to={() => {
            localStorage.setItem("filmID", String(content.id));
            props.to();
          }}
        ></ContentItem>
      ))}
    </div>
  );
};

const Profile: React.FunctionComponent<PageType> = (props) => {
  const [user, updateUser] = useState<User | undefined>();
  const [watched, updateWatched] = useState<ListItem[]>([]);
  const [toWatch, updateToWatch] = useState<ListItem[]>([]);
  const [favorites, updateFavorites] = useState<ListItem[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const fetchProfileFunc = functions.httpsCallable("fetchProfile");
      const response = await fetchProfileFunc({});

      updateUser(response.data.user);
      updateWatched(response.data.watched);
      updateToWatch(response.data.toWatch);
      updateFavorites(response.data.favorites);
    };

    fetchProfile();
  }, []);

  return (
    <PageContainer className={styles.MainBox}>
      <Header
        title="Profile"
        iconLeft={<Icon>{faChevronLeft}</Icon>}
        iconRight={<Icon>{faCog}</Icon>}
        actionRight={() => props.to("Settings")}
      ></Header>
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
          <div className={styles.FollowsItem}>
            <div>Followers</div>
            <div>{user?.followersCount}</div>
          </div>
          <div className={styles.FollowsItem}>
            <div>Following</div>
            <div>{user?.followingCount}</div>
          </div>
        </div>
        <TabBarSecondary tabs={["To Watch", "Watched", "Favorites"]}>
          {[
            <Tab
              key={0}
              contents={toWatch}
              to={() => props.to("FilmDetail")}
            ></Tab>,
            <Tab
              key={1}
              contents={watched}
              to={() => props.to("FilmDetail")}
            ></Tab>,
            <Tab
              key={2}
              contents={favorites}
              to={() => props.to("FilmDetail")}
            ></Tab>,
          ]}
        </TabBarSecondary>
      </div>
    </PageContainer>
  );
};

export default Profile;
