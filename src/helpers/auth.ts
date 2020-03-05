import { auth } from "../config/firebase";

async function signup(email: string, password: string) {
  try {
    await auth.createUserWithEmailAndPassword(email, password);
  } catch (error) {
    console.error(error);
  }
}

async function login(email: string, password: string) {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.error(error);
  }
}

async function logout() {
  try {
    await auth.signOut();
  } catch (error) {
    console.error(error);
  }
}

export { signup, login, logout };
