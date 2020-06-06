import React, { useState, useEffect } from "react";
import PageContainer from "../core/PageContainer";
import Input from "../core/Input";
import Header from "../core/Header";
import Button from "../core/Button";
import Icon from "../common/Icon";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./Settings.module.scss";
// import { functions } from "../config/firebase";
import { PageType } from "../App";
import ProfilePicture from "../components/ProfilePicture";
import { logout } from "../helpers/auth";

const Settings: React.FunctionComponent<PageType> = (props) => {
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState("");

  const onImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.item(0)) {
      const imageFile = e.currentTarget.files.item(0)!;
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => setImageURL(reader.result as string);
    }
  };

  useEffect(() => {
    setUserName(localStorage.username);
    setName(localStorage.name);
    setImageURL(localStorage.image_url);
  }, []);

  return (
    <PageContainer>
      <div className={styles.MainBox}>
        <Header
          title="Settings"
          iconLeft={<Icon>{faChevronLeft}</Icon>}
          actionLeft={() => props.back!()}
        ></Header>
        <div className={styles.ImgContainer}>
          <ProfilePicture
            name={name}
            image_url={imageURL}
            canEdit={true}
            onImageSelect={onImageSelect}
          ></ProfilePicture>
        </div>
        <Input
          placeholder="Username"
          value={userName}
          onChange={(event) => setUserName(event.currentTarget.value)}
        ></Input>
        <Input
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        ></Input>
        <Button
          onClick={() => {
            console.log(name, userName);
          }}
        >
          Save
        </Button>
        <Button
          onClick={async () => {
            await logout();
            props.to("Login");
          }}
        >
          Logout
        </Button>
      </div>
    </PageContainer>
  );
};

export default Settings;
