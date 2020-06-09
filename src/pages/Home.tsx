import React, { useState } from "react";
import { PageType } from "../App";
import Feed from "./Feed";
import Search from "./Search";
import Profile from "./Profile";
import FilmDetail from "./FilmDetail";
import Settings from "./Settings";
import TVShowDetail from "./TVShowDetail";
import TabBar, { TabBarOptions } from "../core/TabBar";

type PageOptions =
  | "Feed"
  | "Search"
  | "Profile"
  | "FilmDetail"
  | "Settings"
  | "TVShowDetail";

const pages: { [key: string]: React.ComponentType<PageType> } = {
  Feed,
  Search,
  Profile,
  FilmDetail,
  Settings,
  TVShowDetail,
};

const Home: React.FunctionComponent<PageType> = (props) => {
  const [selectedTab, setSelectedTab] = useState<TabBarOptions>("Feed");
  const [selectedPage, setSelectedPage] = useState<PageOptions>("Feed");
  const [history, setHistory] = useState<PageOptions[]>([]);
  const [attributes, setAttributes] = useState<any>();

  const onSelectedTab = (tab: TabBarOptions) => {
    setSelectedTab(tab);
    setSelectedPage(tab);
    setAttributes(undefined);
  };

  const onSelectedPage = (page: PageOptions) => {
    setSelectedPage(page);
  };

  const Page = pages[selectedPage];

  return (
    <>
      <Page
        to={(page: string, attributes) => {
          setHistory([...history, selectedPage]);
          onSelectedPage(page as PageOptions);
          if (
            attributes &&
            attributes.userUID === localStorage.userUID &&
            (page as PageOptions) === "Profile"
          ) {
            setAttributes(undefined);
            onSelectedTab("Profile");
          } else {
            setAttributes(attributes);
          }
        }}
        back={() => {
          const to = history.pop();
          onSelectedPage(to!);
          setHistory(history);
        }}
        toggleTheme={props.toggleTheme}
        attributes={attributes}
      ></Page>
      <TabBar selectedTab={selectedTab} onClick={onSelectedTab}></TabBar>
    </>
  );
};

export type { PageOptions };
export default Home;
