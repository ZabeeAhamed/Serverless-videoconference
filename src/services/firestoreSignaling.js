import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function createRoom(offer) {
  const roomRef = doc(collection(db, "rooms"));
  await setDoc(roomRef, {
    offer: { type: offer.type, sdp: offer.sdp },
    createdAt: serverTimestamp(),
  });
  return roomRef.id;
}

export async function addCallerCandidate(roomId, candidate) {
  const candidatesRef = collection(db, "rooms", roomId, "callerCandidates");
  await addDoc(candidatesRef, candidate);
}

export async function addCalleeCandidate(roomId, candidate) {
  const candidatesRef = collection(db, "rooms", roomId, "calleeCandidates");
  await addDoc(candidatesRef, candidate);
}

export async function getRoomOffer(roomId) {
  const roomRef = doc(db, "rooms", roomId);
  const snap = await getDoc(roomRef);
  return snap.exists() ? snap.data().offer : null;
}

export async function saveRoomAnswer(roomId, answer) {
  const roomRef = doc(db, "rooms", roomId);
  await updateDoc(roomRef, { answer: { type: answer.type, sdp: answer.sdp } });
}

export function subscribeToAnswer(roomId, cb) {
  const roomRef = doc(db, "rooms", roomId);
  return onSnapshot(roomRef, snap => {
    const data = snap.data();
    if (data && data.answer) cb(data.answer);
  });
}

export function subscribeToCallerCandidates(roomId, cb) {
  const ref = collection(db, "rooms", roomId, "callerCandidates");
  return onSnapshot(ref, snap => {
    snap.docChanges().forEach(c => {
      if (c.type === "added") cb(c.doc.data());
    });
  });
}

export function subscribeToCalleeCandidates(roomId, cb) {
  const ref = collection(db, "rooms", roomId, "calleeCandidates");
  return onSnapshot(ref, snap => {
    snap.docChanges().forEach(c => {
      if (c.type === "added") cb(c.doc.data());
    });
  });
}
