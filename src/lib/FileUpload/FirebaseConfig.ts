import { ref, getStorage } from "firebase/storage";
import { app } from "../../services/firebase";
import { FIREBASE_STORAGE_BUCKET } from "../../config/env";

export default class FirebaseConfig {
  firebaseStorage;

  constructor() {
    this.firebaseStorage = getStorage(app);
  }

  getStorageRef(filename: string) {
    return ref(this.firebaseStorage, filename);
  }

  getPathStorageFromUrl(url: string) {
    const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_STORAGE_BUCKET}/o/`;

    let imagePath: string = url.replace(baseUrl, "");

    const indexOfEndPath = imagePath.indexOf("?");
    imagePath = imagePath
      .substring(0, indexOfEndPath)
      .replace(/%2F/g, "/")
      .replace(/%20/g, " ");

    return imagePath;
  }

  generateFilenameForFirebase(originalname: string) {
    return `${new Date().getTime()}-${Math.floor(Math.random() * 5000)}-${
      originalname.split(" ").join("-") || "unknown"
    }`;
  }
}
