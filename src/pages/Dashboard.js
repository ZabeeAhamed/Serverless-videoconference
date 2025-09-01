import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const navigate = useNavigate();
  const [joinRoomId, setJoinRoomId] = useState("");
  const [error, setError] = useState("");

  const handleCreateRoom = () => {
    // Routing: /room/new (Room ID will be generated in Room.js)
    navigate("/room/new");
  };
  

  const handleJoinRoom = async () => {
    const roomId = joinRoomId.trim();
    if (!roomId) {
      setError("Room ID required.");
      return;
    }
    const roomRef = doc(db, "rooms", roomId);
    const docSnap = await getDoc(roomRef);
    if (!docSnap.exists()) {
      setError("Invalid Room: Room does not exist.");
      return;
    }
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Video Conference Dashboard</h1>
      <button
        className="bg-green-600 text-white rounded px-8 py-3 w-full mb-6"
        onClick={handleCreateRoom}
      >
        Create Room
      </button>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={joinRoomId}
          onChange={e => { setError(""); setJoinRoomId(e.target.value); }}
          className="border w-full p-3 rounded"
          placeholder="Enter Room ID to Join"
        />
        <button
          className="bg-blue-600 text-white rounded px-8 py-3 w-full"
          onClick={handleJoinRoom}
        >
          Join Room
        </button>
        {error && <div className="text-red-600 font-semibold">{error}</div>}
      </div>
    </div>
  );
}
