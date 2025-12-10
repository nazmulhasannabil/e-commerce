import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
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

export const createNewProduct = async ({ data, featureImage, imageList }) => {
  if (!data?.title) {
    throw new Error("Title is required");
  }
  if (!featureImage) {
    throw new Error("Feature Image is required");
  }
  
  // Upload feature image to ImgBB
  const featureImageURL = await uploadToImgBB(featureImage);

  let imageURLList = [];

  // Upload image list to ImgBB
  for (let i = 0; i < imageList?.length; i++) {
    const image = imageList[i];
    const url = await uploadToImgBB(image);
    imageURLList.push(url);
  }

  const newId = doc(collection(db, `ids`)).id;

  await setDoc(doc(db, `products/${newId}`), {
    ...data,
    featureImageURL: featureImageURL,
    imageList: imageURLList,
    id: newId,
    timestampCreate: Timestamp.now(),
  });
};

export const updateProduct = async ({ data, featureImage, imageList }) => {
  if (!data?.title) {
    throw new Error("Title is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }

  let featureImageURL = data?.featureImageURL ?? "";

  // Upload feature image to ImgBB if provided
  if (featureImage) {
    featureImageURL = await uploadToImgBB(featureImage);
  }

  let imageURLList = imageList?.length === 0 ? data?.imageList : [];

  // Upload new images to ImgBB
  for (let i = 0; i < imageList?.length; i++) {
    const image = imageList[i];
    const url = await uploadToImgBB(image);
    imageURLList.push(url);
  }

  await setDoc(doc(db, `products/${data?.id}`), {
    ...data,
    featureImageURL: featureImageURL,
    imageList: imageURLList,
    timestampUpdate: Timestamp.now(),
  });
};

export const deleteProduct = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  await deleteDoc(doc(db, `products/${id}`));
};