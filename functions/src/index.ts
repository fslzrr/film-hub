import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
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
    `https://api.themoviedb.org/3/movie/${filmID}?api_key=${"Insert here API KEY"}&language=en-US`
  );
  const castAndCrewRequest = axios.get(
    `https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${"Insert here API KEY"}`
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

  let rating;
  let review;
  filmRatings.forEach((doc) => (rating = doc.data()));
  filmReviews.forEach((doc) => (review = doc.data()));

  return { film, castAndCrew, rating, review };
});

export const postReviewRating = functions.https.onCall(async (data) => {
  const promises = [];

  // Validate request content has a valid review and/or rating

  if (data.review) {
    const reviewQuery = admin
      .firestore()
      .collection("reviews")
      .where("userUID", "==", data.userUID)
      .where("filmID", "==", data.filmID)
      .limit(1);

    const reviewDoc = await reviewQuery.get();

    if (!reviewDoc.empty) {
      reviewDoc.forEach((x) => {
        promises.push(
          admin.firestore().collection("reviews").doc(x.id).set(data.review)
        );
      });
    } else {
      const review = { ...data.review, createdAt: new Date() };
      promises.push(admin.firestore().collection("reviews").doc().set(review));
    }
  }

  if (data.rating) {
    const ratingQuery = admin
      .firestore()
      .collection("ratings")
      .where("userUID", "==", data.userUID)
      .where("filmID", "==", data.filmID)
      .limit(1);

    const ratingDoc = await ratingQuery.get();

    if (!ratingDoc.empty) {
      ratingDoc.forEach((x) => {
        promises.push(
          admin.firestore().collection("ratings").doc(x.id).set(data.rating)
        );
      });
    } else {
      const rating = { ...data.rating, createdAt: new Date() };
      promises.push(admin.firestore().collection("ratings").doc().set(rating));
    }
  }

  const results = await Promise.all(promises);

  return results;
});
