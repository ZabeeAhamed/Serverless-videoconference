// components/VideoChat.jsx
import React, { useRef, useEffect } from "react";

export default function VideoChat({ localStream, remoteStream }) {
  const localRef = useRef(null);
  const remoteRef = useRef(null);

  useEffect(() => {
    if (localRef.current) {
      try { localRef.current.srcObject = localStream; } catch (e) {}
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteRef.current) {
      try { remoteRef.current.srcObject = remoteStream; } catch (e) {}
    }
  }, [remoteStream]);

  return (
    <div className="flex space-x-4 p-4">
      <video
        ref={localRef}
        className="w-1/2 border"
        autoPlay
        playsInline
        muted
      />
      <video
        ref={remoteRef}
        className="w-1/2 border"
        autoPlay
        playsInline
      />
    </div>
  );
}
