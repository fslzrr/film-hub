import React from "react";
import { PageType } from "../App";
import Header from "../core/Header";
import PageContainer from "../core/PageContainer";

const Home: React.FunctionComponent<PageType> = (props) => {
  return (
    <>
      <Header title="FilmHub"></Header>
      <PageContainer>Home page</PageContainer>
    </>
  );
};

export default Home;
