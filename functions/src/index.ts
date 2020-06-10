import * as users from "./users";
import * as films from "./films";
import * as interactions from "./interactions";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// users functions
export const createUser = users.createUser;
export const fetchUserData = users.fetchUserData;
export const fetchProfile = users.fetchProfile;
export const handleFollow = users.handleFollow;
export const getFollowers = users.getFollowers;
export const getFollowings = users.getFollowings;

// films functions
export const fetchFilm = films.fetchFilm;
export const fetchTVShow = films.fetchTVShow;

// interactions functions
export const searchQuery = interactions.searchQuery;
export const loadFeed = interactions.loadFeed;
export const postFeedback = interactions.postFeedback;
export const addToList = interactions.addToList;
export const removeFromList = interactions.removeFromList;
