import React from "react";
import ThemeContext from "../theme/themeContext";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faLayerGroup,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Icon from "../common/Icon";
import styles from "./TabBar.module.scss";

const tabs: {
  [key: string]: { icon: IconDefinition; title: string };
} = {
  Feed: { icon: faLayerGroup, title: "Feed" },
  Search: { icon: faSearch, title: "Search" },
  Profile: { icon: faUser, title: "Profile" },
};

type TabBarOptions = "Feed" | "Search" | "Profile";
type TabBarType = {
  selectedTab: TabBarOptions;
  onClick: (selectedTab: TabBarOptions) => void;
};

const TabBar: React.FC<TabBarType> = (props) => {
  return (
    <ThemeContext.Consumer>
      {({ themeClass, theme }) => (
        <div className={`${styles.TabBar} ${themeClass(styles, theme)}`}>
          {Object.keys(tabs).map((tabName, i) => {
            const tab = tabs[tabName];
            const selected = props.selectedTab === tabName;
            return (
              <div
                key={`${tabName}-${i}`}
                className={`${selected && styles.Selected}`}
                onClick={() => props.onClick(tabName as TabBarOptions)}
              >
                <Icon>{tab.icon}</Icon>
                <h5>{tab.title}</h5>
              </div>
            );
          })}
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export type { TabBarOptions };
export default TabBar;
