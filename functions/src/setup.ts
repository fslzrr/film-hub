import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "gs://film-hub-a1c1b.appspot.com",
});

export default admin;
