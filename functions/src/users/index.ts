import * as functions from "firebase-functions";
import admin from "../setup";
import { docToData } from "../utils";
import Follow from "../types/Follow";

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
        image_url: selfUser!.image_url,
        username: selfUser!.username,
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

export const getFollowers = functions.https.onCall(
  async (data: { userUID: string }, context) => {
    const userUID = context.auth?.uid;
    if (!userUID)
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Please login to access this resource"
      );

    const followersSnapshot = await admin
      .firestore()
      .collection("users")
      .doc(data.userUID)
      .collection("followers")
      .get();

    const followers = followersSnapshot.docs.map(docToData);

    return followers;
  }
);

export const getFollowings = functions.https.onCall(
  async (data: { userUID: string }, context) => {
    const userUID = context.auth?.uid;
    if (!userUID)
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Please login to access this resource"
      );

    const followingSnapshot = await admin
      .firestore()
      .collection("users")
      .doc(data.userUID)
      .collection("following")
      .get();

    const following = followingSnapshot.docs.map(docToData);

    return following;
  }
);
