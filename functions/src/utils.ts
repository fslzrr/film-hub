import axios, { AxiosResponse } from "axios";
import admin from "./setup";

// Helper types
type FirebaseWrite = Promise<FirebaseFirestore.WriteResult>;

// Helper functions

function docToData(
  data: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
): FirebaseFirestore.DocumentData {
  return data.data();
}

const MOVIES_DB_BASE_PATH = "https://api.themoviedb.org/3";
const MOVIES_DB_API_KEY = "insert here your api key"; // temporal solution
function moviesDbGet(
  specificPath: string,
  params: { [K: string]: string | number | boolean }
): Promise<AxiosResponse<any>> {
  return axios.get(MOVIES_DB_BASE_PATH + specificPath, {
    params: { api_key: MOVIES_DB_API_KEY, ...params },
  });
}

const moviesdb = { get: moviesDbGet };

async function saveImage(path: string, imgBase64: string) {
  const cleanedImg = imgBase64.replace(/data:.+?,/, "");
  const imageBuffer = Buffer.from(cleanedImg, "base64");
  const imageByteArray = new Uint8Array(imageBuffer);

  const ext = imgBase64.split("data:image/")[1].split(";")[0];

  const bucket = admin.storage().bucket();
  const file = bucket.file(`images/${path}.${ext}`);

  await file.save(imageByteArray);
  const urls = await file.getSignedUrl({
    action: "read",
    expires: "03-09-2500",
  });

  return urls[0];
}

const storage = { saveImage };

export type { FirebaseWrite };
export { moviesdb, storage, docToData };
