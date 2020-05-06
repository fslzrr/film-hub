import React, { useState } from "react";
import { PageType } from "../App";
import Feed from "./Feed";
import Search from "./Search";
import Profile from "./Profile";
import FilmDetail from "./FilmDetail";
import Settings from "./Settings";
import TabBar, { TabBarOptions } from "../core/TabBar";

type PageOptions = "Feed" | "Search" | "Profile" | "FilmDetail" | "Settings";

const pages: { [key: string]: React.ComponentType<PageType> } = {
  Feed,
  Search,
  Profile,
  FilmDetail,
  Settings,
};

const Home: React.FunctionComponent<PageType> = (props) => {
  const [selectedTab, setSelectedTab] = useState<TabBarOptions>("Feed");
  const [selectedPage, setSelectedPage] = useState<PageOptions>("Feed");
  const [history, setHistory] = useState<PageOptions[]>([]);

  const onSelectedTab = (tab: TabBarOptions) => {
    setSelectedTab(tab);
    setSelectedPage(tab);
  };

  const onSelectedPage = (page: PageOptions) => {
    setSelectedPage(page);
  };

  const Page = pages[selectedPage];

  return (
    <>
      <Page
        to={(page: string) => {
          setHistory([...history, selectedPage]);
          onSelectedPage(page as PageOptions);
        }}
        back={() => {
          const to = history.pop();
          onSelectedPage(to!);
          setHistory(history);
        }}
        toggleTheme={props.toggleTheme}
      ></Page>
      <TabBar selectedTab={selectedTab} onClick={onSelectedTab}></TabBar>
    </>
  );
};

export default Home;
