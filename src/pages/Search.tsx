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
          <div key={0}>
            {users.map((user) => (
              <SearchResult
                key={user.uid}
                imgURL={user.image_url}
                label={user.name}
                to={() => {}}
              ></SearchResult>
            ))}
          </div>,
          <div key={1}>
            {films.map((film) => (
              <SearchResult
                key={film.id}
                imgURL={
                  film.poster_path
                    ? `https://image.tmdb.org/t/p/w1280${film.poster_path}`
                    : undefined
                }
                label={film.title}
                to={() => {
                  localStorage.setItem("filmID", String(film.id));
                  props.to("FilmDetail");
                }}
              ></SearchResult>
            ))}
          </div>,
        ]}
      </TabBarSecondary>
    </PageContainer>
  );
};

export default Search;
