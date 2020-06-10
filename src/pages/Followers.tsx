import React, { useState, useEffect } from "react";
import { functions } from "../config/firebase";
import { PageType } from "../App";
import { Follower } from "../types/Follower";
import PageContainer from "../core/PageContainer";
import Header from "../core/Header";
import SearchResult from "../components/SearchResult";
import Icon from "../common/Icon";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

async function getUsersList(
  service: firebase.functions.HttpsCallable,
  userUID: string
): Promise<Follower[]> {
  const response = await service({ userUID });
  return response.data as Follower[];
}

const Followers: React.FunctionComponent<PageType> = (props) => {
  const { userUID, title, watchingFollowers } = props.attributes as {
    userUID: string;
    title: string;
    watchingFollowers: boolean;
  };

  const usersService = functions.httpsCallable(
    watchingFollowers ? "getFollowers" : "getFollowings"
  );

  const [users, setUsers] = useState<Follower[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const users = await getUsersList(usersService, userUID);
      setUsers(users);
    };
    getUsers();
  }, []);

  return (
    <PageContainer>
      <Header
        title={title}
        iconLeft={<Icon>{faChevronLeft}</Icon>}
        actionLeft={() => props.back!()}
      ></Header>
      {users.length === 0 ? (
        <p>No {title.toLowerCase()} were found :(</p>
      ) : (
        users.map((user, i) => (
          <SearchResult
            key={i}
            label={user.username}
            imgURL={user.image_url}
            to={() => props.to("Profile", { userUID: user.userUID })}
          ></SearchResult>
        ))
      )}
    </PageContainer>
  );
};

export default Followers;
