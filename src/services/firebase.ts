import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyByq3B7pRh7oVGwjoAODNCx8lKl3qytDYk",
  authDomain: "mimitha-e1a81.firebaseapp.com",
  projectId: "mimitha-e1a81",
  storageBucket: "mimitha-e1a81.appspot.com",
  messagingSenderId: "847447214366",
  appId: "1:847447214366:web:83956177748d36d7f3a10f",
  measurementId: "G-0P4RSPVHNQ",
};

const app = initializeApp(firebaseConfig);

const storage = getStorage();
const getStorageRef: any = (filename: string) => ref(storage, filename);

export async function uploadFileOnFirebase({
  file,
  filename,
  folder,
}: UploadFileOnFirebaseT): Promise<string> {
  const configuredFileName = `${new Date().getTime()}-${
    filename.split(" ").join("-") || "unknown"
  }`;

  const folders = {
    icons: "/icons",
    products: "/products",
  };

  const storageRef = getStorageRef(`${folders[folder]}/configuredFileName`);
  const uploadedFileRef = await uploadBytes(storageRef, file);

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
  folder: "icons" | "products";
}
