import React, { useState } from "react";
import { PageType } from "../App";
import PageContainer from "../core/PageContainer";
import SearchInput from "../components/SearchInput";
import User from "../types/user";
import { Film } from "../types/film";
import TabBarSecondary from "../core/TabBarSecondary";
import SearchResult from "../components/SearchResult";

const Search: React.FunctionComponent<PageType> = (props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [films, setFilms] = useState<Film[]>([]);

  const onResults = (users: User[], films: Film[]) => {
    setUsers(users);
    setFilms(films);
  };

  return (
    <PageContainer>
      <SearchInput onResults={onResults} />
      <TabBarSecondary tabs={["Users", "Films"]}>
        {[
          <div>
            {users.map((user) => (
              <SearchResult
                imgURL={user.image_url}
                label={user.name}
              ></SearchResult>
            ))}
          </div>,
          <div>
            {films.map((film) => (
              <SearchResult
                imgURL={
                  film.poster_path
                    ? `https://image.tmdb.org/t/p/w1280${film.poster_path}`
                    : undefined
                }
                label={film.title}
              ></SearchResult>
            ))}
          </div>,
        ]}
      </TabBarSecondary>
    </PageContainer>
  );
};

export default Search;
