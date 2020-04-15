import React from "react";
import { PageType } from "../App";
import Header from "../core/Header";
import PageContainer from "../core/PageContainer";

const Feed: React.FunctionComponent<PageType> = (props) => {
  return (
    <PageContainer>
      <Header title="FilmHub"></Header>
      <p>Feed Page</p>
    </PageContainer>
  );
};

export default Feed;
