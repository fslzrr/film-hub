type Feed = {
  createdAt: { _seconds: number; _nanoseconds: number };
  id: number;
  posterPath: string;
  rating: number;
  review: string;
  season?: number;
  title: string;
  type: string;
  userUID: string;
  username: string;
};

export default Feed;
