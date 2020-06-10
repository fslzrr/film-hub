import React, { useState } from "react";
import { PageType, PageOptions } from "../App";
import Feed from "./Feed";
import Search from "./Search";
import Profile from "./Profile";
import FilmDetail from "./FilmDetail";
import Settings from "./Settings";
import TVShowDetail from "./TVShowDetail";
import Followers from "./Followers";
import TabBar, { TabBarOptions } from "../core/TabBar";

const pages: { [key: string]: React.ComponentType<PageType> } = {
  Feed,
  Search,
  Profile,
  FilmDetail,
  Settings,
  TVShowDetail,
  Followers,
};

const Home: React.FunctionComponent<PageType> = (props) => {
  const [pageHistory, setPageHistory] = useState<PageOptions[]>(["Feed"]);
  const [attributesHistory, setAttributesHistory] = useState<any[]>([
    undefined,
  ]);

  const Page = pages[pageHistory[0]];

  const onSelectedTab = (tab: TabBarOptions) => {
    setPageHistory([tab as PageOptions]);
    setAttributesHistory([undefined]);
  };

  const to = (page: PageOptions, attributes: any) => {
    if (
      page === "Profile" &&
      attributes &&
      attributes.userUID === localStorage.userUID
    ) {
      onSelectedTab("Profile");
      return;
    }

    setPageHistory([page, ...pageHistory]);
    setAttributesHistory([attributes, ...attributesHistory]);
  };

  const back = () => {
    const [, ...pages] = pageHistory;
    const [, ...attributes] = attributesHistory;
    setPageHistory(pages);
    setAttributesHistory(attributes);
  };

  return (
    <>
      <Page
        to={to}
        back={back}
        toggleTheme={props.toggleTheme}
        attributes={attributesHistory[0]}
      ></Page>
      <TabBar
        selectedTab={pageHistory[0] as TabBarOptions}
        onClick={onSelectedTab}
      ></TabBar>
    </>
  );
};

export type { PageOptions };
export default Home;
