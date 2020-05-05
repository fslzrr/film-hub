import axios, { AxiosResponse } from "axios";

// Helper types
type FirebaseWrite = Promise<FirebaseFirestore.WriteResult>;

// Helper functions

function docToData(
  data: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
): FirebaseFirestore.DocumentData {
  console.log("data", data, data.data());
  return data.data();
}

const MOVIES_DB_BASE_PATH = "https://api.themoviedb.org/3";
const MOVIES_DB_API_KEY = "insert here you api key"; // temporal solution
function moviesDbGet(
  specificPath: string,
  params: { [K: string]: string | number | boolean }
): Promise<AxiosResponse<any>> {
  return axios.get(MOVIES_DB_BASE_PATH + specificPath, {
    params: { api_key: MOVIES_DB_API_KEY, ...params },
  });
}

const moviesdb = { get: moviesDbGet };

export type { FirebaseWrite };
export { moviesdb, docToData };
