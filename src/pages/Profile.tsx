import React, { useState, useEffect } from "react";
import { PageType } from "../App";
import PageContainer from "../core/PageContainer";
import styles from "./Profile.module.scss";
import Header from "../core/Header";
import Icon from "../common/Icon";
import { faChevronLeft, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { functions } from "../config/firebase";
import User from "../types/user";
import ListItem from "../types/listItem";

type TabItemType = {
  isSelected: boolean;
  display: string;
  tabID: number;
  onClick: (tabID: number) => void;
};

const TabItem: React.FunctionComponent<TabItemType> = (props) => {
  return (
    <div
      className={styles.TabItem}
      style={
        props.isSelected
          ? {
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(11px)",
            }
          : {}
      }
      onClick={() => props.onClick(props.tabID)}
    >
      {props.display}
    </div>
  );
};

type ContentItemType = {
  poster_path: string;
};

const ContentItem: React.FunctionComponent<ContentItemType> = (props) => {
  return (
    <div className={styles.ContentItem}>
      <img src={`https://image.tmdb.org/t/p/w1280${props.poster_path}`}></img>
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
};

const Tab: React.FunctionComponent<TabType> = (props) => {
  return (
    <div className={styles.Tab}>
      {props.contents.map((content) => (
        <ContentItem
          key={content.id}
          poster_path={content.poster_path}
        ></ContentItem>
      ))}
    </div>
  );
};

const Profile: React.FunctionComponent<PageType> = (props) => {
  const [selectedTab, updateSelectedTab] = useState(0);
  const [user, updateUser] = useState<User | undefined>();
  const [watched, updateWatched] = useState<ListItem[]>([]);
  const [toWatch, updateToWatch] = useState<ListItem[]>([]);
  const [favorites, updateFavorites] = useState<ListItem[]>([]);

  const tabItems = [
    { display: "To Watch", tabID: 0 },
    { display: "Watched", tabID: 1 },
    { display: "Favorites", tabID: 2 },
  ];
  const tabs = [watched, toWatch, favorites];

  useEffect(() => {
    const fetchProfile = async () => {
      const fetchProfileFunc = functions.httpsCallable("fetchProfile");
      const response = await fetchProfileFunc({
        userUID: localStorage.getItem("userUID"),
      });

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
        iconRight={<Icon>{faEllipsisV}</Icon>}
      ></Header>
      <div className={styles.MainContainer}>
        <div className={styles.MainInfoContainer}>
          <img src={user?.image_url}></img>
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
        <div className={styles.Tabs}>
          {tabItems.map((tab) => (
            <TabItem
              key={tab.tabID}
              isSelected={selectedTab === tab.tabID}
              display={tab.display}
              tabID={tab.tabID}
              onClick={updateSelectedTab}
            ></TabItem>
          ))}
        </div>
        {tabItems.map((tab) =>
          tab.tabID === selectedTab ? (
            <Tab key={tab.tabID} contents={tabs[tab.tabID]}></Tab>
          ) : null
        )}
      </div>
    </PageContainer>
  );
};

export default Profile;
