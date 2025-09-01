// src/pages/Room.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createRoomWithFirestore, joinRoomWithFirestore, deleteRoomInFirestore } from '../hooks/useWebRTC';

export default function Room() {
  const { roomId: paramRoomId } = useParams();
  const navigate = useNavigate();

  const [actualRoomId, setActualRoomId] = useState(paramRoomId);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // store runtime objects across rerenders
  const pcRef = useRef(null);
  const unsubRef = useRef({});
  const roomRefRef = useRef(null);
  const isCreatorRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function start() {
      try {
        console.log('Requesting local media');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!mounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        setLocalStream(stream);

        if (paramRoomId === 'new') {
          // Create room (caller)
          const result = await createRoomWithFirestore(stream, (s) => {
            // callback receives a MediaStream -> assign to state
            setRemoteStream(s);
          }, (state) => {
            console.log('Caller state:', state);
          });

          // Save runtime refs (pc and unsubscribers)
          pcRef.current = result.pc;
          unsubRef.current.unsubRoom = result.unsubRoom;
          unsubRef.current.unsubCallee = result.unsubCallee;
          roomRefRef.current = result.roomRef;
          isCreatorRef.current = true;

          setActualRoomId(result.roomId);
          // Update URL without remounting the component
          window.history.replaceState(null, '', `/room/${result.roomId}`);
          console.log('Room created with ID:', result.roomId);

        } else {
          // Join existing room (callee)
          const result = await joinRoomWithFirestore(paramRoomId, stream, (s) => {
            setRemoteStream(s);
          }, (state) => {
            console.log('Callee state:', state);
          });

          pcRef.current = result.pc;
          unsubRef.current.unsubCaller = result.unsubCaller;
          roomRefRef.current = result.roomRef;
          isCreatorRef.current = false;
          setActualRoomId(paramRoomId);
          console.log('Joined existing room:', paramRoomId);
        }
      } catch (e) {
        console.error('Room setup failed:', e);
        alert('Could not get media or join room: ' + e.message);
        navigate('/');
      }
    }

    start();

    // cleanup on unmount
    return () => {
      mounted = false;
      console.log('Cleaning up Room component');
      if (pcRef.current) {
        try { pcRef.current.close(); } catch (e) {}
        pcRef.current = null;
      }
      if (localStream) localStream.getTracks().forEach(t => t.stop());
      if (remoteStream) remoteStream.getTracks().forEach(t => t.stop());
      if (unsubRef.current.unsubRoom) unsubRef.current.unsubRoom();
      if (unsubRef.current.unsubCallee) unsubRef.current.unsubCallee();
      if (unsubRef.current.unsubCaller) unsubRef.current.unsubCaller();
      // optionally delete room if this client created it
      if (roomRefRef.current && isCreatorRef.current) {
        deleteRoomInFirestore(roomRefRef.current).catch(e => console.warn('cleanup delete room error', e));
      }
    };
    // we intentionally run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <h2 className="text-xl font-bold mb-2">Room: {actualRoomId}</h2>
      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-1/2 border rounded" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 border rounded" />
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Share your Room ID: <span className="font-mono">{actualRoomId}</span>
      </div>
    </div>
  );
}
