import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { docToData, moviesdb } from "./utils";
import Feedback from "./types/Feedback";

admin.initializeApp({ credential: admin.credential.applicationDefault() });

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const createUser = functions.https.onCall(async (data) => {
  const email = data.email;
  const password = data.password;

  if (!email || !password || !data.name || !data.username)
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Missing user information"
    );

  const existingUser = await admin
    .firestore()
    .collection("users")
    .where("username", "==", data.username)
    .get();

  if (!existingUser.empty)
    throw new functions.https.HttpsError(
      "already-exists",
      "The selected username is already in use, please select another."
    );

  try {
    const newUser = await admin.auth().createUser({
      email,
      password,
      displayName: data.name,
    });

    const userData = {
      uid: newUser.uid,
      email,
      name: data.name,
      username: data.username,
      image_url: "",
      followingCount: 0,
      followersCount: 0,
    };

    await admin.firestore().collection("users").doc(userData.uid).set(userData);
  } catch (err) {
    throw new functions.https.HttpsError("failed-precondition", err.message);
  }
});

export const fetchUserData = functions.https.onCall(async (data, context) => {
  const userUID = context.auth?.uid;

  if (!userUID)
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Please login to access this resource"
    );

  const userDocReference = admin.firestore().collection("users").doc(userUID);
  const userDoc = await userDocReference.get();

  if (!userDoc.exists)
    throw new functions.https.HttpsError("not-found", "User not found");

  return userDoc.data();
});

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

export const postFeedback = functions.https.onCall(async (data, context) => {
  const userUID = context.auth?.uid;
  if (!userUID)
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Please login to access this resource"
    );

  const feedback: Feedback = data.feedback;

  const searchQuery = (type: "film" | "tvShow") => {
    if (type === "film")
      return admin
        .firestore()
        .collection("feedbacks")
        .where("id", "==", feedback.id)
        .where("type", "==", feedback.type)
        .where("userUID", "==", feedback.userUID)
        .limit(1)
        .get();

    return admin
      .firestore()
      .collection("feedbacks")
      .where("id", "==", feedback.id)
      .where("type", "==", feedback.type)
      .where("season", "==", feedback.season)
      .where("userUID", "==", feedback.userUID)
      .limit(1)
      .get();
  };

  const feedbackDocs = await searchQuery(feedback.type);

  if (feedbackDocs.docs.length === 0) {
    const feedbackObj = { ...feedback, createdAt: new Date() };
    await admin.firestore().collection("feedbacks").add(feedbackObj);
    return feedbackObj;
  }

  const updatedFeedback = await admin
    .firestore()
    .collection("feedbacks")
    .doc(feedbackDocs.docs[0].id)
    .update(feedback);
  return updatedFeedback;
});

export const fetchProfile = functions.https.onCall(async (data, context) => {
  // If userUID comes in the request it means you want someone else's profile.
  const userUID = data.userUID || context.auth?.uid;

  if (!context.auth?.uid)
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Please login to access this resource"
    );

  const userPromise = admin.firestore().collection("users").doc(userUID!).get();
  const watchedPromise = admin
    .firestore()
    .collection("users")
    .doc(userUID!)
    .collection("watched")
    .get();
  const toWatchPromise = admin
    .firestore()
    .collection("users")
    .doc(userUID!)
    .collection("toWatch")
    .get();
  const favoritesPromise = admin
    .firestore()
    .collection("users")
    .doc(userUID!)
    .collection("favorites")
    .get();

  const [userDoc, watchedDocs, toWatchDocs, favoritesDocs] = await Promise.all([
    userPromise,
    watchedPromise,
    toWatchPromise,
    favoritesPromise,
  ]);

  const user = userDoc.data();
  const watched = watchedDocs.docs.map(docToData);
  const toWatch = toWatchDocs.docs.map(docToData);
  const favorites = favoritesDocs.docs.map(docToData);

  return { user, watched, toWatch, favorites };
});

export const searchQuery = functions.https.onCall(async (data) => {
  const filmsPromise = moviesdb.get("/search/movie", {
    query: data.query,
    language: "en-US",
    page: 1,
    adult: false,
  });

  const usersPromise = admin
    .firestore()
    .collection("users")
    .where("name", "==", data.query)
    .limit(20)
    .get();

  try {
    const [filmsResponse, usersDoc] = await Promise.all([
      filmsPromise,
      usersPromise,
    ]);
    const films = filmsResponse.data.results;
    const users = usersDoc.docs.map(docToData);
    return { users, films };
  } catch (e) {
    console.error(e);
    return { users: [], films: [] };
  }
});

type ListItem = {
  id: number;
  poster_path: string;
  title: string;
  type: "film" | "show";
};

type ListType = "toWatch" | "watched" | "favorites";

export const addToList = functions.https.onCall(
  async (data: { list: ListType; listItem: ListItem }, context) => {
    const userUID = context.auth?.uid;

    if (!userUID)
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Please login to access this resource"
      );

    if (
      !data.list ||
      (data.list !== "toWatch" &&
        data.list !== "watched" &&
        data.list !== "favorites")
    ) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Desired list missing or incorrect"
      );
    }

    await admin
      .firestore()
      .collection("users")
      .doc(userUID)
      .collection(data.list)
      .doc()
      .set(data.listItem);
  }
);

export const removeFromList = functions.https.onCall(
  async (data: { list: ListType; id: string }, context) => {
    const userUID = context.auth?.uid;

    if (!userUID)
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Please login to access this resource"
      );

    if (
      !data.list ||
      (data.list !== "toWatch" &&
        data.list !== "watched" &&
        data.list !== "favorites")
    ) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Desired list missing or incorrect"
      );
    }

    const listItem = await admin
      .firestore()
      .collection("users")
      .doc(userUID)
      .collection(data.list)
      .where("id", "==", data.id)
      .limit(1)
      .get();

    if (!listItem.empty) {
      const [docID] = listItem.docs.map((doc) => doc.id);

      await admin
        .firestore()
        .collection("users")
        .doc(userUID)
        .collection(data.list)
        .doc(docID)
        .delete();
    }
  }
);
