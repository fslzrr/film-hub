import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import { FirebaseWrite, docToData, moviesdb } from "./utils";

admin.initializeApp({ credential: admin.credential.applicationDefault() });

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const createUser = functions.https.onCall(async (data) => {
  const email = data.email;
  const password = data.password;

  // Validate all user data is in the request and that the username is not repeated
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
  };

  await admin.firestore().collection("users").doc(userData.uid).set(userData);
});

export const fetchUserData = functions.https.onCall(async (data) => {
  // Validate userUID comes in the request and that it exists in the DB
  const userUID = data;
  const userDocReference = admin.firestore().collection("users").doc(userUID);
  const userDoc = await userDocReference.get();

  if (userDoc.exists) return userDoc.data();

  return undefined;
});

export const fetchMovie = functions.https.onCall(async (data) => {
  const userUID = data.userUID;
  const filmID = data.filmID;

  if (!userUID || !filmID)
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The UserID or filmID are missing in the request"
    );

  // Validate TMDB response was successful
  const filmRequest = axios.get(
    `https://api.themoviedb.org/3/movie/${filmID}?api_key=${"Insert here API KEY"}&language=en-US` // fix
  );
  const castAndCrewRequest = axios.get(
    `https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${"Insert here API KEY"}` // fix
  );

  const [filmResponse, castAndCrewResponse] = await Promise.all([
    filmRequest,
    castAndCrewRequest,
  ]);

  const film = filmResponse.data;
  const castAndCrew = castAndCrewResponse.data;
  const filmRatingQuery = admin
    .firestore()
    .collection("ratings")
    .where("userUID", "==", userUID)
    .where("filmID", "==", filmID)
    .limit(1);
  const filmReviewQuery = admin
    .firestore()
    .collection("reviews")
    .where("userUID", "==", userUID)
    .where("filmID", "==", filmID)
    .limit(1);

  const [filmRatings, filmReviews] = await Promise.all([
    filmRatingQuery.get(),
    filmReviewQuery.get(),
  ]);

  const rating = filmRatings.docs.map((doc) => doc.data());
  const review = filmReviews.docs.map((doc) => doc.data());

  return { film, castAndCrew, rating, review };
});

export const postReviewRating = functions.https.onCall(async (data) => {
  const genReviewPromises = async (): Promise<FirebaseWrite[]> => {
    const reviewQuery = admin
      .firestore()
      .collection("reviews")
      .where("userUID", "==", data.userUID)
      .where("filmID", "==", data.filmID)
      .limit(1);

    const reviewDoc = await reviewQuery.get();

    if (!reviewDoc.empty) {
      return reviewDoc.docs.map((review) =>
        admin.firestore().collection("reviews").doc(review.id).set(data.review)
      );
    }

    const review = { ...data.review, createdAt: new Date() };
    return [admin.firestore().collection("reviews").doc().set(review)];
  };

  const genRatingPromises = async (): Promise<FirebaseWrite[]> => {
    const ratingQuery = admin
      .firestore()
      .collection("ratings")
      .where("userUID", "==", data.userUID)
      .where("filmID", "==", data.filmID)
      .limit(1);

    const ratingDoc = await ratingQuery.get();

    if (!ratingDoc.empty) {
      return ratingDoc.docs.map((rating) =>
        admin.firestore().collection("ratings").doc(rating.id).set(data.rating)
      );
    }

    const rating = { ...data.rating, createdAt: new Date() };
    return [admin.firestore().collection("ratings").doc().set(rating)];
  };

  const reviewPromises = data.review
    ? await genReviewPromises()
    : <FirebaseWrite[]>[];

  const ratingPromises = data.rating
    ? await genRatingPromises()
    : <FirebaseWrite[]>[];

  const promises = [...reviewPromises, ...ratingPromises];
  const results = await Promise.all(promises);

  return results;
});

export const fetchProfile = functions.https.onCall(async (data) => {
  const userUID = data.userUID;

  const userPromise = admin.firestore().collection("users").doc(userUID).get();
  const watchedPromise = admin
    .firestore()
    .collection("users")
    .doc(userUID)
    .collection("watched")
    .get();
  const toWatchPromise = admin
    .firestore()
    .collection("users")
    .doc(userUID)
    .collection("toWatch")
    .get();
  const favoritesPromise = admin
    .firestore()
    .collection("users")
    .doc(userUID)
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
