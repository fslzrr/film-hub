import React, { useState } from "react";
import { debounce } from "lodash";
import { functions } from "../config/firebase";
import User from "../types/user";
import { Film } from "../types/Film";

import styles from "./SearchInput.module.scss";
import ThemeContext from "../theme/themeContext";

type SearchQueryResponse = {
  users: User[];
  films: Film[];
};

type SearchInputProps = {
  onResults: (users: User[], films: Film[]) => void;
};

const SearchInput: React.FunctionComponent<SearchInputProps> = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchQuery = functions.httpsCallable("searchQuery");

  const requestQuery = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await searchQuery({ query });
      const data: SearchQueryResponse = response.data;
      props.onResults(data.users, data.films);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedHandleQuery = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      const formattedQuery = query.trim();
      requestQuery(formattedQuery);
    },
    600
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    debouncedHandleQuery(event);
  };

  return (
    <ThemeContext.Consumer>
      {({ themeClass, theme }) => (
        <div
          className={`${styles.SearchInput} ${
            isLoading && styles.SearchInputLoading
          } ${themeClass(styles, theme)}`}
        >
          <input placeholder="Search..." onChange={handleQueryChange}></input>
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export default SearchInput;
