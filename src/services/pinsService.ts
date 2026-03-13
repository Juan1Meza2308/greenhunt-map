import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import { MockPin } from "@/data/mockData";

const PINS_COL = "pins";
const EXPIRY_MS = 48 * 60 * 60 * 1000; // 48 hours

/** Real-time subscription to available, non-expired pins. Returns unsubscribe fn. */
export function subscribeToPins(callback: (pins: MockPin[]) => void): () => void {
  const q = query(collection(db, PINS_COL), where("status", "==", "available"));

  return onSnapshot(
    q,
    (snapshot) => {
      const now = Date.now();
      const pins: MockPin[] = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data();
          return {
            ...data,
            id: docSnap.id,
            // serverTimestamp() is null on optimistic write — fall back to now
            createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
          } as MockPin;
        })
        // Client-side expiry filter (avoids needing a composite Firestore index)
        .filter((p) => now - p.createdAt.getTime() < EXPIRY_MS);

      callback(pins);
    },
    (err) => console.error("[pinsService] snapshot error:", err)
  );
}

/** Upload photo to Storage (if data URL) then save pin document to Firestore. */
export async function addPin(pinData: Omit<MockPin, "id">): Promise<string> {
  let photoURL = pinData.photoURL;

  // Upload to Firebase Storage if it's a captured data URL
  if (photoURL.startsWith("data:")) {
    const storageRef = ref(storage, `pins/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`);
    await uploadString(storageRef, photoURL, "data_url");
    photoURL = await getDownloadURL(storageRef);
  }

  const docRef = await addDoc(collection(db, PINS_COL), {
    ...pinData,
    photoURL,
    createdAt: serverTimestamp(),
    expiresAt: Timestamp.fromDate(new Date(Date.now() + EXPIRY_MS)),
  });

  return docRef.id;
}

/** Mark pin as rescued (keeps document but hides from map). */
export async function markPinRescued(pinId: string): Promise<void> {
  await updateDoc(doc(db, PINS_COL, pinId), { status: "rescued" });
}

/** Delete pin document (community report: "Ya no está"). */
export async function markPinGone(pinId: string): Promise<void> {
  await deleteDoc(doc(db, PINS_COL, pinId));
}
