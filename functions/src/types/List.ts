type ListType = "toWatch" | "watched" | "favorites";
type ListItem = {
  id: number;
  poster_path: string;
  title: string;
  type: "film" | "show";
};

export { ListType, ListItem };