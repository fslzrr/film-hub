import React from "react";
import { PageType } from "../App";
import Header from "../core/Header";
import PageContainer from "../core/PageContainer";

const Search: React.FunctionComponent<PageType> = (props) => {
  return (
    <>
      <Header title="Search"></Header>
      <PageContainer>Search Page</PageContainer>
    </>
  );
};

export default Search;
