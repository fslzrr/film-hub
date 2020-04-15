import React from "react";
import { PageType } from "../App";
import Header from "../core/Header";
import PageContainer from "../core/PageContainer";

const Feed: React.FunctionComponent<PageType> = (props) => {
  return (
    <>
      <Header title="FilmHub"></Header>
      <PageContainer>Feed Page</PageContainer>
    </>
  );
};

export default Feed;
