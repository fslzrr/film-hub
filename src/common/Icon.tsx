import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

type IconProps = {
  children: IconDefinition;
};

const Icon: React.FC<IconProps> = (props) => {
  return <FontAwesomeIcon icon={props.children}></FontAwesomeIcon>;
};

export type { IconProps };
export default Icon;
