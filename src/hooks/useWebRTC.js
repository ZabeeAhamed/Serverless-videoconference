// src/hooks/useWebRTC.js
import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  onSnapshot,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

// STUN (add TURN in production)
export const servers = {
  iceServers: [
    { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
  ],
  iceCandidatePoolSize: 10,
};

// Create a peer connection and set ontrack immediately
function createPeerConnection(setRemoteStream, label = 'pc') {
  const pc = new RTCPeerConnection(servers);

  // Keep an assembled remote stream so adding single tracks always works
  const remoteStream = new MediaStream();

  // ontrack is installed early so we never miss streams
  pc.ontrack = (event) => {
    // event.track is a MediaStreamTrack — always add it
    console.log(`[${label}] ontrack kind=${event.track.kind}`);
    remoteStream.addTrack(event.track);
    // setRemoteStream with the same MediaStream object (stable ref)
    setRemoteStream(remoteStream);
  };

  pc.oniceconnectionstatechange = () =>
    console.log(`[${label}] ICE connection state:`, pc.iceConnectionState);
  pc.onconnectionstatechange = () =>
    console.log(`[${label}] connection state:`, pc.connectionState);

  return { pc, remoteStream };
}

// Caller: create room, publish offer, listen for answer & remote ICE
export async function createRoomWithFirestore(localStream, setRemoteStream, onState) {
  const { pc } = createPeerConnection(setRemoteStream, 'caller');

  // Attach local tracks (after ontrack has been set)
  localStream.getTracks().forEach((t) => {
    pc.addTrack(t, localStream);
    console.log('[caller] added local track', t.kind);
  });

  // Prepare Firestore doc + subcollections
  const roomRef = doc(collection(db, 'rooms'));
  const roomId = roomRef.id;
  const callerCandidates = collection(roomRef, 'callerCandidates');
  const calleeCandidates = collection(roomRef, 'calleeCandidates');

  // Push caller ICE candidates to Firestore
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(callerCandidates, event.candidate.toJSON());
      console.log('[caller] pushed ICE candidate to Firestore');
    }
  };

  // Create offer & write to Firestore
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  await setDoc(roomRef, {
    offer: { type: offer.type, sdp: offer.sdp },
    createdAt: serverTimestamp(),
    status: 'waiting',
  });
  console.log('[caller] room created with offer:', roomId);

  // Listen for answer and setRemoteDescription when it arrives
  const unsubRoom = onSnapshot(roomRef, async (snap) => {
    const data = snap.data();
    if (!data) return;
    if (data.answer && !pc.currentRemoteDescription) {
      console.log('[caller] answer detected in Firestore — applying remote description');
      await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      onState && onState('connected');
    }
  });

  // Listen for callee ICE candidates and add them
  const unsubCallee = onSnapshot(calleeCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const c = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(c)).catch((e) => {
          if (c) console.warn('[caller] addIceCandidate error:', e);
        });
      }
    });
  });

  return { roomId, pc, unsubRoom, unsubCallee, roomRef, isCreator: true };
}

// Callee: read offer, set remote desc, create answer, publish ICE
export async function joinRoomWithFirestore(roomId, localStream, setRemoteStream, onState) {
  const roomRef = doc(db, 'rooms', roomId);
  const snap = await getDoc(roomRef);
  if (!snap.exists()) throw new Error('Room does not exist');

  const { pc } = createPeerConnection(setRemoteStream, 'callee');

  // Attach local tracks
  localStream.getTracks().forEach((t) => {
    pc.addTrack(t, localStream);
    console.log('[callee] added local track', t.kind);
  });

  const callerCandidates = collection(roomRef, 'callerCandidates');
  const calleeCandidates = collection(roomRef, 'calleeCandidates');

  // Push callee ICE candidates to Firestore
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(calleeCandidates, event.candidate.toJSON());
      console.log('[callee] pushed ICE candidate to Firestore');
    }
  };

  // Set caller offer as remote description
  const roomData = snap.data();
  await pc.setRemoteDescription(new RTCSessionDescription(roomData.offer));
  console.log('[callee] setRemoteDescription(offer)');

  // Create answer and store it
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  await setDoc(roomRef, { answer: { type: answer.type, sdp: answer.sdp }, answeredAt: serverTimestamp(), status: 'connected' }, { merge: true });
  console.log('[callee] answer created and written to Firestore');

  // Listen for caller ICE candidates and add them
  const unsubCaller = onSnapshot(callerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const c = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(c)).catch((e) => {
          if (c) console.warn('[callee] addIceCandidate error:', e);
        });
      }
    });
  });

  onState && onState('connected');
  return { pc, unsubCaller, roomRef, isCreator: false };
}

// Optional cleanup: delete all candidates and the room doc
export async function deleteRoomInFirestore(roomRef) {
  try {
    console.log('[cleanup] deleting room', roomRef.id);
    const callerCandidates = collection(roomRef, 'callerCandidates');
    const calleeCandidates = collection(roomRef, 'calleeCandidates');
    const [callerSnap, calleeSnap] = await Promise.all([getDocs(callerCandidates), getDocs(calleeCandidates)]);
    const deletes = [];
    callerSnap.forEach(d => deletes.push(deleteDoc(d.ref)));
    calleeSnap.forEach(d => deletes.push(deleteDoc(d.ref)));
    await Promise.all(deletes);
    await deleteDoc(roomRef);
    console.log('[cleanup] deleted room and candidates');
  } catch (e) {
    console.warn('[cleanup] failed to delete:', e);
  }
}
