import { auth, functions } from "../config/firebase";

async function signup(email: string, password: string) {
  try {
    await auth.createUserWithEmailAndPassword(email, password);
  } catch (error) {
    console.error(error);
  }
}

async function login(email: string, password: string) {
  try {
    const credentials = await auth.signInWithEmailAndPassword(email, password);
    const fetchUserData = functions.httpsCallable("fetchUserData");
    const userData = await fetchUserData(credentials.user?.uid);

    localStorage.setItem("userUID", credentials.user?.uid as string);
    localStorage.setItem("username", userData.data.username);
  } catch (error) {
    console.error(error);
  }
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
