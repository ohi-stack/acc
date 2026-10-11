import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  getIdToken
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, googleAuthProvider, testFirestoreConnection, handleFirestoreError, OperationType } from '../../lib/firebase';
import { setAuthToken } from '../api';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  isFirebaseReady: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate Firestore Connection on Boot (SKILL Mandatory Requirement)
  useEffect(() => {
    let isMounted = true;
    testFirestoreConnection().then((connected) => {
      if (isMounted) {
        setIsFirebaseReady(connected);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const token = await getIdToken(currentUser);
          setAuthToken(token);

          // Sync user profile to Firestore
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userDocRef).catch((err) => {
            // Non-blocking on initial get
            console.warn('Initial profile lookup:', err?.message);
            return null;
          });

          if (!userSnap || !userSnap.exists()) {
            await setDoc(userDocRef, {
              uid: currentUser.uid,
              email: currentUser.email || 'operator@onegodian.com',
              displayName: currentUser.displayName || 'Authorized ACC Operator',
              role: currentUser.email === 'onegodianone@gmail.com' ? 'super_admin' : 'acc_operator',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            }).catch((err) => {
              handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`);
            });
          }
        } catch (err: any) {
          console.error('Firebase Auth Token/Firestore Sync Error:', err);
        }
      } else {
        setAuthToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setError(err?.message || 'Google Sign-In failed');
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
      setAuthToken(null);
    } catch (err: any) {
      console.error('Sign out failed:', err);
      setError(err?.message || 'Sign-out failed');
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        isFirebaseReady,
        signInWithGoogle,
        signOut,
        error,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
