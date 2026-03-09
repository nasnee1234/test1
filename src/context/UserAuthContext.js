import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database";
import { auth } from "../firebase";
import app from "../firebase";

const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("member");

  const db = getDatabase(app);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await set(ref(db, `users/${cred.user.uid}`), {
      email,
      role: "member",
      createdAt: Date.now(),
    });

    return cred;
  };

  const logOut = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const snap = await get(ref(db, `users/${currentUser.uid}`));
          if (snap.exists()) {
            setRole(snap.val().role || "member");
          } else {
            setRole("member");
          }
        } catch (error) {
          console.log("read role error:", error);
          setRole("member");
        }
      } else {
        setRole("member");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, role, login, signUp, logOut }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}