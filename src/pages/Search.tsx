import React from "react";
import { PageType } from "../App";
import Header from "../core/Header";
import PageContainer from "../core/PageContainer";

const Search: React.FunctionComponent<PageType> = (props) => {
  return (
    <PageContainer>
      <Header title="Search"></Header>
      <p>Search Page</p>
    </PageContainer>
  );
};

export default Search;
