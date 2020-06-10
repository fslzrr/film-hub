import React, { useState } from "react";
import { PageType } from "../App";
import PageContainer from "../core/PageContainer";
import SearchInput from "../components/SearchInput";
import User from "../types/user";
import { Film } from "../types/Film";
import TabBarSecondary from "../core/TabBarSecondary";
import SearchResult from "../components/SearchResult";
import { TVShow } from "../types/TVShow";

const Search: React.FunctionComponent<PageType> = (props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [films, setFilms] = useState<Film[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);

  const onResults = (users: User[], films: Film[], tvShows: TVShow[]) => {
    setUsers(users || []);
    setFilms(films || []);
    setTvShows(tvShows || []);
  };

  return (
    <PageContainer>
      <SearchInput onResults={onResults} />
      <TabBarSecondary tabs={["Users", "Films", "TV"]}>
        {[
          <div key={0}>
            {users.map((user) => (
              <SearchResult
                key={user.uid}
                imgURL={user.image_url}
                label={user.username}
                to={() => {
                  props.to("Profile", { userUID: user.uid });
                }}
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
                  props.to("FilmDetail", { filmID: film.id });
                }}
              ></SearchResult>
            ))}
          </div>,
          <div key={2}>
            {tvShows.map((tvShow) => (
              <SearchResult
                key={tvShow.id}
                imgURL={
                  tvShow.poster_path
                    ? `https://image.tmdb.org/t/p/w1280${tvShow.poster_path}`
                    : undefined
                }
                label={tvShow.name}
                to={() => {
                  props.to("TVShowDetail", { tvShowID: tvShow.id });
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
