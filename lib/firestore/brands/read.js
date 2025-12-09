"use client";

import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useSWRSubscription from "swr/subscription";

// Get all brands
export const getAllBrands = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "brands"));
    const brands = [];
    querySnapshot.forEach((doc) => {
      const brandData = {
        id: doc.id,
        ...doc.data()
      };
      brands.push(brandData);
    });
    return brands;
  } catch (error) {
    throw new Error("Error fetching brands: " + error.message);
  }
};

// Get a single brand by ID
export const getBrandById = async (id) => {
  try {
    const docRef = doc(db, "brands", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error("Brand not found");
    }
  } catch (error) {
    throw new Error("Error fetching brand: " + error.message);
  }
};

// Delete a brand by ID
export const deleteBrand = async (id) => {
  try {
    await deleteDoc(doc(db, "brands", id));
    return { success: true };
  } catch (error) {
    throw new Error("Error deleting brand: " + error.message);
  }
};

// Update a brand by ID
export const updateBrand = async (id, data) => {
  try {
    await updateDoc(doc(db, "brands", id), data);
    return { success: true };
  } catch (error) {
    throw new Error("Error updating brand: " + error.message);
  }
};

// Hook for using brands in components
export function useBrands() {
  const { data, error } = useSWRSubscription(["brands"], ([path], { next }) => {
    const ref = collection(db, path);
    const unsub = onSnapshot(
      ref,
      (snapshot) =>
        next(
          null,
          snapshot.docs.length === 0
            ? null
            : snapshot.docs.map((snap) => snap.data())
        ),
      (err) => next(err, null)
    );
    return () => unsub();
  });

  return { data, error: error?.message, isLoading: data === undefined };
}