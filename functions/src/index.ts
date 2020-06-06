import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { docToData, moviesdb } from "./utils";
import Feedback from "./types/Feedback";
import Follow from "./types/Follow";

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
  // Get if you follow an user. If userUID is yourself, it will be undefined;
  const followedPromise = admin
    .firestore()
    .collection("users")
    .doc(context.auth?.uid)
    .collection("following")
    .doc(userUID)
    .get();
  const feedbacksPromise = admin
    .firestore()
    .collection("feedbacks")
    .where("userUID", "==", userUID)
    .get();

  const [
    userDoc,
    watchedDocs,
    toWatchDocs,
    favoritesDocs,
    followedDoc,
    feedbacksDocs,
  ] = await Promise.all([
    userPromise,
    watchedPromise,
    toWatchPromise,
    favoritesPromise,
    followedPromise,
    feedbacksPromise,
  ]);

  const user = userDoc.data();
  const watched = watchedDocs.docs.map(docToData);
  const toWatch = toWatchDocs.docs.map(docToData);
  const favorites = favoritesDocs.docs.map(docToData);
  const followed = followedDoc.exists;
  const feedbacks = feedbacksDocs.docs.map(docToData);

  return { user, watched, toWatch, favorites, followed, feedbacks };
});

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

      console.log("FEEDBACKS", feedbacks.size);

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

export const handleFollow = functions.https.onCall(
  async (data: { follow: Follow; followed: boolean }, context) => {
    const userUID = context.auth?.uid;
    const db = admin.firestore();

    if (!userUID)
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Please login to access this resource"
      );

    const batch = db.batch();

    if (data.followed) {
      const increment = admin.firestore.FieldValue.increment(1);
      const followedUserRef = db.collection("users").doc(data.follow.userUID);
      const selfUserRef = db.collection("users").doc(context.auth?.uid!);
      const selfUser = (await selfUserRef.get()).data();
      batch.set(
        followedUserRef,
        { followersCount: increment },
        { merge: true }
      );
      batch.set(selfUserRef, { followingCount: increment }, { merge: true });
      batch.set(followedUserRef.collection("followers").doc(selfUser!.uid), {
        userUID: selfUser!.uid,
        username: selfUser!.username,
        poster_path: selfUser!.username,
      });
      batch.set(
        selfUserRef.collection("following").doc(data.follow.userUID),
        data.follow
      );
    } else {
      const decrement = admin.firestore.FieldValue.increment(-1);
      const unfollowedUser = db.collection("users").doc(data.follow.userUID);
      const selfUserRef = db.collection("users").doc(context.auth?.uid!);
      const deleteFollower = db
        .collection("users")
        .doc(data.follow.userUID)
        .collection("followers")
        .doc(context.auth?.uid!);
      const deleteFollowing = db
        .collection("users")
        .doc(context.auth?.uid!)
        .collection("following")
        .doc(data.follow.userUID);
      batch.set(unfollowedUser, { followersCount: decrement }, { merge: true });
      batch.set(selfUserRef, { followingCount: decrement }, { merge: true });
      batch.delete(deleteFollower);
      batch.delete(deleteFollowing);
    }
    return await batch.commit();
  }
);

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
  const followingIDS = following.docs.map((x) => x.data().userUID);
  if (followingIDS.length === 0) return [];
  const feed = await admin
    .firestore()
    .collection("feedbacks")
    .where("userUID", "in", followingIDS)
    .orderBy("createdAt", "desc")
    .get();
  return feed.docs.map((x) => x.data());
});
