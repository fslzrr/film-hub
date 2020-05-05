type User = {
  uid?: string;
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  followingCount?: number;
  followersCount?: number;
  image_url?: string;
};

export default User;
