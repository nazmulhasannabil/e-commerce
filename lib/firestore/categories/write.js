import { doc, collection, Timestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const createNewCategory = async ({ data, imageUrl }) => {
    if (!data?.name) {
        throw new Error("Name is Required")
    }
    if (!data?.slug) {
        throw new Error("Slug is Required")
    }
    
    if (!imageUrl) {
        throw new Error("Image URL is required")
    }
    
    // Validate URL format
    try {
        new URL(imageUrl);
    } catch (e) {
        throw new Error("Invalid image URL")
    }

    const newId = doc(collection(db, "ids")).id;

    await setDoc(doc(db, "categories", newId), {
        ...data,
        id: newId,
        image: imageUrl, // Store the image URL directly
        timestampCreate: Timestamp.now(),
    });
};

// Update an existing category
export const updateCategory = async (id, { data, imageUrl }) => {
    if (!data?.name) {
        throw new Error("Name is Required")
    }
    if (!data?.slug) {
        throw new Error("Slug is Required")
    }
    
    if (!imageUrl) {
        throw new Error("Image URL is required")
    }
    
    // Validate URL format
    try {
        new URL(imageUrl);
    } catch (e) {
        throw new Error("Invalid image URL")
    }

    await updateDoc(doc(db, "categories", id), {
        ...data,
        image: imageUrl, // Store the image URL directly
        timestampUpdate: Timestamp.now(),
    });
};