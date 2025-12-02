import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = await getUserProfile(userCredential.user.uid);
    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
};

// Alias for backward compatibility
export { signIn as login };

export const signUp = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user: User = {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName,
      role: 'user',
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), user);
    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign up');
  }
};

// Alias for backward compatibility
export { signUp as signup };

export const signInWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if user profile exists
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      // Create new user profile
      const user: User = {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        displayName: userCredential.user.displayName || undefined,
        photoURL: userCredential.user.photoURL || undefined,
        role: 'user',
        createdAt: new Date(),
        lastLogin: new Date(),
      };
      
      await setDoc(doc(db, 'users', user.uid), user);
      return user;
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in with Google');
  }
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

// Alias for backward compatibility
export { sendPasswordResetEmail as resetPassword };

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
};

export const getUserProfile = async (uid: string): Promise<User> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    return userDoc.data() as User;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get user profile');
  }
};

export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        const user = await getUserProfile(firebaseUser.uid);
        callback(user);
      } catch (error) {
        console.error('Failed to get user profile:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

export const isAdmin = async (uid: string): Promise<boolean> => {
  try {
    const user = await getUserProfile(uid);
    return user.role === 'admin';
  } catch (error) {
    return false;
  }
};