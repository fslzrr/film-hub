import * as functions from "firebase-functions";
import admin from "../setup";
import Feedback from "../types/Feedback";
import { moviesdb, docToData } from "../utils";
import { ListType, ListItem } from "../types/List";

export const searchQuery = functions.https.onCall(async (data) => {
  const filmsPromise = moviesdb.get("/search/movie", {
    query: data.query,
    language: "en-US",
    page: 1,
    adult: false,
  });
  const tvShowsPromise = moviesdb.get("/search/tv", {
    query: data.query,
    language: "en-US",
    page: 1,
    adult: false,
  });

  const usersPromise = admin
    .firestore()
    .collection("users")
    .where("username", "==", data.query)
    .limit(20)
    .get();

  try {
    const [filmsResponse, tvShowsResponse, usersDoc] = await Promise.all([
      filmsPromise,
      tvShowsPromise,
      usersPromise,
    ]);
    const films = filmsResponse.data.results;
    const tvShows = tvShowsResponse.data.results;
    const users = usersDoc.docs.map(docToData);
    return { users, tvShows, films };
  } catch (e) {
    console.error(e);
    return { users: [], films: [] };
  }
});

export const loadFeed = functions.https.onCall(async (data, context) => {
  const userUID = context.auth?.uid;

  if (!userUID)
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Please login to access this resource"
    );

  const following = await admin
    .firestore()
    .collection("users")
    .doc(userUID)
    .collection("following")
    .get();
  const followingIDS = [
    userUID,
    ...following.docs.map((x) => x.data().userUID),
  ];
  if (followingIDS.length === 0) return [];
  const feed = await admin
    .firestore()
    .collection("feedbacks")
    .where("userUID", "in", followingIDS)
    .orderBy("createdAt", "desc")
    .get();
  return feed.docs.map((x) => x.data());
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
    const foundInWatched = await admin
      .firestore()
      .collection("users")
      .doc(userUID)
      .collection("watched")
      .where("id", "==", feedbackObj.id)
      .get();
    const batch = admin.firestore().batch();
    const add = admin.firestore().collection("feedbacks").doc();
    batch.set(add, feedbackObj);

    // Make sure that the film or tv show were not already added to Watched
    if (foundInWatched.empty) {
      const addToWatched = admin
        .firestore()
        .collection("users")
        .doc(userUID)
        .collection("watched")
        .doc();
      batch.set(addToWatched, {
        id: feedback.id,
        title: feedback.title,
        poster_path: feedback.posterPath,
        type: feedback.type,
      });
    }

    await batch.commit();
    return feedbackObj;
  }

  const updatedFeedback = await admin
    .firestore()
    .collection("feedbacks")
    .doc(feedbackDocs.docs[0].id)
    .update(feedback);
  return updatedFeedback;
});

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
  async (data: { list: ListType; id: string; season?: number }, context) => {
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

    const listItems = await admin
      .firestore()
      .collection("users")
      .doc(userUID)
      .collection(data.list)
      .where("id", "==", data.id)
      .get();
    const feedbacks = await admin
      .firestore()
      .collection("feedbacks")
      .where("userUID", "==", userUID)
      .where("id", "==", data.id)
      .get();

    const batch = admin.firestore().batch();

    if (feedbacks.size === 1) {
      const [docID] = listItems.docs.map((doc) => doc.id);
      const docReference = admin
        .firestore()
        .collection("users")
        .doc(userUID)
        .collection(data.list)
        .doc(docID);
      batch.delete(docReference);
    }

    // If list type is watched, also remove the feedback
    if (data.list === "watched") {
      const feedbacksQuery = admin
        .firestore()
        .collection("feedbacks")
        .where("userUID", "==", userUID)
        .where("id", "==", data.id);

      // If is tvShow, add season condition to query
      const feedbacks = await (data.season
        ? feedbacksQuery.where("season", "==", data.season).get()
        : feedbacksQuery.get());

      if (!feedbacks.empty) {
        const docReference = admin
          .firestore()
          .collection("feedbacks")
          .doc(feedbacks.docs[0].id);
        batch.delete(docReference);
      }
    }
    await batch.commit();
  }
);
