import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Get all categories
export const getAllCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categories = [];
    querySnapshot.forEach((doc) => {
      const categoryData = {
        id: doc.id,
        ...doc.data()
      };
      console.log("Fetched category:", categoryData); // Debug log
      categories.push(categoryData);
    });
    console.log("All fetched categories:", categories); // Debug log
    return categories;
  } catch (error) {
    throw new Error("Error fetching categories: " + error.message);
  }
};

// Get a single category by ID
export const getCategoryById = async (id) => {
  try {
    const docRef = doc(db, "categories", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error("Category not found");
    }
  } catch (error) {
    throw new Error("Error fetching category: " + error.message);
  }
};

// Delete a category by ID
export const deleteCategory = async (id) => {
  try {
    await deleteDoc(doc(db, "categories", id));
    return { success: true };
  } catch (error) {
    throw new Error("Error deleting category: " + error.message);
  }
};

// Update a category by ID
export const updateCategory = async (id, data) => {
  try {
    await updateDoc(doc(db, "categories", id), data);
    return { success: true };
  } catch (error) {
    throw new Error("Error updating category: " + error.message);
  }
};