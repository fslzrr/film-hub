type Feedback = {
  createdAt?: Date;
  id: number;
  posterPath: string;
  title: string;
  season?: number;
  rating: number;
  review?: string;
  userUID: string;
  username: string;
  type: "film" | "tvShow";
};

export default Feedback;
