import { initializeApp } from "firebase/app";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, where, orderBy, limit, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "default_api_key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "renteasy-solutions"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "renteasy-solutions",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "renteasy-solutions"}.firebasestorage.app`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "default_sender_id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "default_app_id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Phone authentication functions
export const sendOTP = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const verifyOTP = async (verificationId: string, otp: string) => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    const result = await signInWithCredential(auth, credential);
    return result;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

// Firestore helper functions
export const createUserProfile = async (uid: string, userData: any) => {
  try {
    await setDoc(doc(db, "users", uid), userData);
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const getProperties = async (filters?: any) => {
  try {
    let q = query(collection(db, "properties"), where("isAvailable", "==", true));
    
    if (filters?.area) {
      q = query(q, where("area", "==", filters.area));
    }
    
    if (filters?.propertyType) {
      q = query(q, where("propertyType", "==", filters.propertyType));
    }
    
    q = query(q, orderBy("createdAt", "desc"), limit(20));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting properties:", error);
    throw error;
  }
};

export const createProperty = async (propertyData: any) => {
  try {
    const docRef = await addDoc(collection(db, "properties"), propertyData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

export const updateProperty = async (propertyId: string, updates: any) => {
  try {
    const docRef = doc(db, "properties", propertyId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
};

export const deleteProperty = async (propertyId: string) => {
  try {
    await deleteDoc(doc(db, "properties", propertyId));
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};

export const getLocalBusinesses = async (area?: string) => {
  try {
    let q = query(collection(db, "localBusinesses"), where("isActive", "==", true));
    
    if (area) {
      q = query(q, where("area", "==", area));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting local businesses:", error);
    throw error;
  }
};

export const getNeighborhoodEvents = async (area?: string) => {
  try {
    let q = query(collection(db, "neighborhoodEvents"), where("isActive", "==", true));
    
    if (area) {
      q = query(q, where("area", "==", area));
    }
    
    q = query(q, orderBy("eventDate", "asc"));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting neighborhood events:", error);
    throw error;
  }
};
