// // components/JoinRoom.jsx
// import React, { useState } from "react";
// import { useWebRTC } from "../hooks/useWebRTC";
// import VideoChat from "./VideoChat";

// export default function JoinRoom() {
//   const [roomIdInput, setRoomIdInput] = useState("");
//   const [joinedRoomId, setJoinedRoomId] = useState(null);
//   const { localStream, remoteStream, joinCall, hangUp } = useWebRTC();

//   const handleJoin = async () => {
//     const id = roomIdInput.trim();
//     if (!id) return alert("Enter Room ID");
//     try {
//       await joinCall(id);
//       setJoinedRoomId(id);
//     } catch (err) {
//       console.error("Failed to join room:", err);
//       alert("Failed to join room: " + (err.message || err));
//     }
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <div className="flex space-x-2">
//         <input value={roomIdInput} onChange={(e) => setRoomIdInput(e.target.value)} placeholder="Room ID" className="flex-grow border p-2 rounded" />
//         <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleJoin}>Join</button>
//       </div>

//       {joinedRoomId && <p>Joined Room: <strong>{joinedRoomId}</strong></p>}

//       <VideoChat localStream={localStream} remoteStream={remoteStream} />
//       <div>
//         <button onClick={() => { hangUp(); setJoinedRoomId(null); }} className="mt-2 px-3 py-1 border rounded">Hang Up</button>
//       </div>
//     </div>
//   );
// }
