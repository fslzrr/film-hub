type Feedback = {
  createdAt?: Date;
  id: number;
  posterPath: string;
  title: string;
  rating: number;
  review?: string;
  userUID: string;
  username: string;
  type: "film" | "tvShow";
  season?: number;
};

export default Feedback;
