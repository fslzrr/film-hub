import React, { useState } from "react";

import styles from "./TabBarSecondary.module.scss";
import ThemeContext from "../theme/themeContext";

type TabBarSecondaryProps = {
  tabs: string[];
  children: JSX.Element[];
};

const TabBarSecondary: React.FunctionComponent<TabBarSecondaryProps> = (
  props
) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  return (
    <ThemeContext.Consumer>
      {({ themeClass, theme }) => (
        <>
          <div
            className={`${styles.TabsContainer} ${themeClass(styles, theme)}`}
          >
            {props.tabs.map((tab, index) => (
              <a
                key={`${tab}-${index}`}
                className={`${styles.TabButton} ${
                  selectedTab === index && styles.TabButtonSelected
                }`}
                onClick={() => setSelectedTab(index)}
              >
                {tab}
              </a>
            ))}
          </div>
          {props.children[selectedTab]}
        </>
      )}
    </ThemeContext.Consumer>
  );
};

export default TabBarSecondary;
