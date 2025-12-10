import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

// Upload image to ImgBB
const uploadToImgBB = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=e2eab96f6583c73dfeb489357e18b6aa`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    if (result.success) {
      return result.data.url;
    } else {
      throw new Error(result.error.message || 'Failed to upload image');
    }
  } catch (error) {
    throw new Error('Failed to upload image: ' + error.message);
  }
};

export const createNewAdmin = async ({ data, image }) => {
  if (!image) {
    throw new Error("Image is Required");
  }
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.email) {
    throw new Error("Email is required");
  }

  const newId = data?.email;

  try {
    // Upload image to ImgBB
    const imageURL = await uploadToImgBB(image);

    await setDoc(doc(db, `admins/${newId}`), {
      ...data,
      id: newId,
      imageURL: imageURL,
      timestampCreate: Timestamp.now(),
    });
  } catch (error) {
    throw error;
  }
};

export const updateAdmin = async ({ data, image }) => {
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }
  if (!data?.email) {
    throw new Error("Email is required");
  }

  const id = data?.id;

  let imageURL = data?.imageURL;

  try {
    if (image) {
      imageURL = await uploadToImgBB(image);
    }

    if (id === data?.email) {
      await updateDoc(doc(db, `admins/${id}`), {
        ...data,
        imageURL: imageURL,
        timestampUpdate: Timestamp.now(),
      });
    } else {
      const newId = data?.email;

      await deleteDoc(doc(db, `admins/${id}`));

      await setDoc(doc(db, `admins/${newId}`), {
        ...data,
        id: newId,
        imageURL: imageURL,
        timestampUpdate: Timestamp.now(),
      });
    }
  } catch (error) {
    throw error;
  }
};

export const deleteAdmin = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  
  try {
    await deleteDoc(doc(db, `admins/${id}`));
  } catch (error) {
    throw error;
  }
};