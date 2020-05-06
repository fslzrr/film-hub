export type ListItem = {
  id: number;
  poster_path: string;
  title: string;
  type: "film" | "show";
};

export type ListType = "toWatch" | "watched" | "favorites";
