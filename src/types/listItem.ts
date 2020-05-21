export type ListItem = {
  id: number;
  poster_path: string;
  title: string;
  type: "film" | "tvShow";
  rating?: number;
  review?: string;
};

export type ListType = "toWatch" | "watched" | "favorites";
