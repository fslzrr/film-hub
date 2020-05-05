import React, { useState } from "react";
import { PageType } from "../App";
import Feed from "./Feed";
import Search from "./Search";
import Profile from "./Profile";
import FilmDetail from "./FilmDetail";
import TabBar, { TabBarOptions } from "../core/TabBar";

type PageOptions = "Feed" | "Search" | "Profile" | "FilmDetail";

const pages: { [key: string]: React.ComponentType<PageType> } = {
  Feed,
  Search,
  Profile,
  FilmDetail,
};

const Home: React.FunctionComponent<PageType> = (props) => {
  const [selectedTab, setSelectedTab] = useState<TabBarOptions>("Feed");
  const [selectedPage, setSelectedPage] = useState<PageOptions>("Feed");

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
        to={(page: string) => onSelectedPage(page as PageOptions)}
        toggleTheme={props.toggleTheme}
      ></Page>
      <TabBar selectedTab={selectedTab} onClick={onSelectedTab}></TabBar>
    </>
  );
};

export default Home;
