import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';
import { auth } from '../firebase';
import app from '../firebase';

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('user');
  const db = getDatabase(app);

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await set(ref(db, `users/${cred.user.uid}`), {
      email,
      role: 'user',
      createdAt: Date.now(),
    });

    return cred;
  }

  function logOut() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const snap = await get(ref(db, `users/${currentUser.uid}`));
          const data = snap.val();
          setRole(data?.role || 'user');
        } catch (error) {
          console.log('read role error:', error);
          setRole('user');
        }
      } else {
        setRole('user');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <userAuthContext.Provider value={{ user, role, login, signUp, logOut }}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}