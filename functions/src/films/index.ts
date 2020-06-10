import * as functions from "firebase-functions";
import admin from "../setup";
import { moviesdb } from "../utils";
import { ListType } from "../types/List";

export const fetchFilm = functions.https.onCall(async (data, context) => {
  const userUID = context.auth?.uid;

  if (!userUID)
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Please login to access this resource"
    );

  const filmID = data.filmID;

  if (!filmID)
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The filmID is missing from the request"
    );

  const listQuery = (list: ListType) =>
    admin
      .firestore()
      .collection("users")
      .doc(userUID)
      .collection(list)
      .where("id", "==", filmID)
      .where("type", "==", "film")
      .limit(1);

  const filmRequest = moviesdb.get(`/movie/${filmID}`, {});
  const castAndCrewRequest = moviesdb.get(`/movie/${filmID}/credits`, {});

  const [filmResponse, castAndCrewResponse] = await Promise.all([
    filmRequest,
    castAndCrewRequest,
  ]);

  const film = filmResponse.data;
  const castAndCrew = castAndCrewResponse.data;
  const filmFeedbackQuery = admin
    .firestore()
    .collection("feedbacks")
    .where("userUID", "==", userUID)
    .where("id", "==", filmID)
    .where("type", "==", "film")
    .limit(1);
  const isToWatchQuery = listQuery("toWatch");
  const isWatchedQuery = listQuery("watched");
  const isFavoriteQuery = listQuery("favorites");

  const [
    filmFeedback,
    isToWatchList,
    isWatchedList,
    isFavoriteList,
  ] = await Promise.all([
    filmFeedbackQuery.get(),
    isToWatchQuery.get(),
    isWatchedQuery.get(),
    isFavoriteQuery.get(),
  ]);

  const feedback = filmFeedback.docs.map((doc) => doc.data());
  const isToWatch = !isToWatchList.empty;
  const isWatched = !isWatchedList.empty;
  const isFavorite = !isFavoriteList.empty;

  return {
    film,
    castAndCrew,
    feedback: feedback[0],
    isToWatch,
    isWatched,
    isFavorite,
  };
});

export const fetchTVShow = functions.https.onCall(async (data, context) => {
  const userUID = context.auth?.uid;

  if (!userUID)
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Please login to access this resource"
    );

  const tvShowID = data.tvShowID;

  if (!tvShowID)
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The tvShowID is missing from the request"
    );

  const listQuery = (list: ListType) =>
    admin
      .firestore()
      .collection("users")
      .doc(userUID)
      .collection(list)
      .where("id", "==", tvShowID)
      .where("type", "==", "tvShow")
      .limit(1)
      .get();

  const tvShowRequest = moviesdb.get(`/tv/${tvShowID}`, {});
  const castAndCrewRequest = moviesdb.get(`/tv/${tvShowID}/credits`, {});

  const [tvShowResponse, castAndCrewResponse] = await Promise.all([
    tvShowRequest,
    castAndCrewRequest,
  ]);
  const tvShow = tvShowResponse.data;
  const castAndCrew = castAndCrewResponse.data;

  const isToWatchQuery = listQuery("toWatch");
  const isFavoriteQuery = listQuery("favorites");
  const seasonsFeedbacksQuery = admin
    .firestore()
    .collection("feedbacks")
    .where("userUID", "==", userUID)
    .where("id", "==", tvShowID)
    .where("type", "==", "tvShow")
    .get();

  const [
    isToWatchList,
    isFavoriteList,
    seasonsFeedbacksList,
  ] = await Promise.all([
    isToWatchQuery,
    isFavoriteQuery,
    seasonsFeedbacksQuery,
  ]);
  const isToWatch = !isToWatchList.empty;
  const isFavorite = !isFavoriteList.empty;
  const seasonsFeedbacks = seasonsFeedbacksList.docs.map((doc) => doc.data());

  return {
    tvShow,
    castAndCrew,
    isToWatch,
    isFavorite,
    seasonsFeedbacks,
  };
});
