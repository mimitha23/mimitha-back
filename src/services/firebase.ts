import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { initializeApp } from "firebase/app";

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from "../config/env";
import { firebaseFolders } from "../config/config";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const storage = getStorage();
const getStorageRef: any = (filename: string) => ref(storage, filename);

export async function uploadFileOnFirebase({
  file,
  filename,
  folder,
  contentType,
}: UploadFileOnFirebaseT): Promise<string> {
  const configuredFileName = `${new Date().getTime()}-${Math.floor(
    Math.random() * 5000
  )}-${filename.split(" ").join("-") || "unknown"}`;

  const storageRef = getStorageRef(
    `${firebaseFolders[folder]}/${configuredFileName}`
  );

  const uploadedFileRef = await uploadBytes(storageRef, file, { contentType });
  const downloadUrl = await getDownloadURL(uploadedFileRef.ref);

  return downloadUrl;
}

export function deleteFile(fileName: string) {
  const storageRef = getStorageRef(fileName);
  deleteObject(storageRef)
    .then(() => {
      console.log("file deleted succssfuly");
    })
    .catch((err) => console.log(err));
}

interface UploadFileOnFirebaseT {
  file: Buffer;
  filename: string;
  folder: keyof typeof firebaseFolders;
  contentType: "image/svg+xml" | "image/webp";
}
