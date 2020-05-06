import { auth, functions } from "../config/firebase";
import User from "../types/user";

async function signup(user: User) {
  const createUser = functions.httpsCallable("createUser");
  await createUser(user);
  console.log("User created successfully");
}

async function login(email: string, password: string) {
  const credentials = await auth.signInWithEmailAndPassword(email, password);
  const fetchUserData = functions.httpsCallable("fetchUserData");
  const userData = await fetchUserData(credentials.user?.uid);

  localStorage.setItem("userUID", credentials.user?.uid as string);
  localStorage.setItem("username", userData.data.username);
  localStorage.setItem("name", userData.data.name);
  localStorage.setItem("image_url", userData.data.image_url);
}

async function logout() {
  try {
    await auth.signOut();
    localStorage.removeItem("userUID");
    localStorage.removeItem("username");
  } catch (error) {
    console.error(error);
  }
}

export { signup, login, logout };
