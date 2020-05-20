import React from "react";
import styles from "./ProfilePicture.module.scss";

type ProfilePictureType = {
  name: string;
  image_url: string | undefined;
  canEdit: boolean;
  onImageSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ProfilePicture: React.FunctionComponent<ProfilePictureType> = (props) => {
  return (
    <div className={styles.Container}>
      {props.image_url ? (
        <img
          className={styles.ProfilePicture}
          src={props.image_url}
          onClick={() => {
            document.getElementById("imageSelector")?.click();
          }}
          alt="User Profile"
        ></img>
      ) : (
        EmptyProfilePic(props.name || "")
      )}
      {props.canEdit ? (
        <input
          type="file"
          accept="image/x-png,image/jpeg"
          id="imageSelector"
          onChange={props.onImageSelect}
        />
      ) : null}
    </div>
  );
};

const EmptyProfilePic = (name: string) => {
  const initials = name
    ? name
        .split(" ")
        .slice(0, 2)
        .reduce((prev, curr) => `${prev}${curr[0]}`, "")
    : "";
  return (
    <div
      onClick={() => {
        document.getElementById("imageSelector")?.click();
      }}
      className={styles.EmptyProfilePic}
    >
      {initials}
    </div>
  );
};

export default ProfilePicture;
