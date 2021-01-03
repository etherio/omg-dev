import { firebaseConfig } from "../config";
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/messaging";
import "firebase/performance";
import "firebase/storage";

export const databaseName = "ctkesqmPHGJHW95gMvnL";

export const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth;

export const database = firebase.database().ref(databaseName);

export const ServerValue = firebase.database.ServerValue;

export const firestore = firebase
  .firestore()
  .collection("public")
  .doc(databaseName);

export const storage = firebase.storage().ref(`databases/${databaseName}`);

export const messaging = firebase.messaging;
