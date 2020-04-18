import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp({ credential: admin.credential.applicationDefault() });

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest(
  async (request, response) => {
    response.send("Hello from Firebase!");
  }
);

export const createUser = functions.https.onCall(async (data) => {
  const email = data.email;
  const password = data.password;

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
