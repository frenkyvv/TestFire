import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import React from 'react';

const firebaseConfig = process.env.NODE_ENV === 'production' ? null : {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const FirebaseContext = React.createContext(null);

const FirebaseProvider = ({ children }) => {
  const firebase = firebaseConfig ? initializeApp(firebaseConfig) : null;
  const fstore = firebase ? getFirestore(firebase) : null;

  return (
    <FirebaseContext.Provider value={fstore}>
      {children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseProvider, FirebaseContext };