// import React, { useState } from "react";
// import { useWebRTC } from "../hooks/useWebRTC";

// let globalRoomId = null; // simple in-memory storage

// export default function CreateRoom() {
//   const [roomId, setRoomId] = useState(globalRoomId);
//   const { localStream, remoteStream, initiateCall, hangUp } = useWebRTC();

//   const handleCreate = async () => {
//     if (globalRoomId) {
//       alert(`Room already exists! Room ID: ${globalRoomId}`);
//       return;
//     }

//     hangUp(); // cleanup if connected
//     try {
//       const id = await initiateCall();
//       globalRoomId = id;  // save globally
//       setRoomId(id);
//       alert(`Room created! Share this Room ID: ${id}`);
//     } catch (err) {
//       console.error("Failed to create room:", err);
//       alert("Failed to create room: " + (err.message || err));
//     }
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <button
//         className="bg-green-600 text-white px-4 py-2 rounded"
//         onClick={handleCreate}
//       >
//         Create Room
//       </button>

//       {roomId && <p>Room ID: <strong>{roomId}</strong></p>}

//       <div className="flex space-x-4 mt-4">
//         <video
//           className="w-1/2 border"
//           autoPlay
//           playsInline
//           muted
//           ref={(video) => video && (video.srcObject = localStream)}
//         />
//         <video
//           className="w-1/2 border"
//           autoPlay
//           playsInline
//           ref={(video) => video && (video.srcObject = remoteStream)}
//         />
//       </div>
//     </div>
//   );
// }
