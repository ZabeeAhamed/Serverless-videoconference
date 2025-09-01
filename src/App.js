// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Room from "./pages/Room";
import NotFound from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        {/* <Route path="/create-room" element={user ? <CreateRoom /> : <Navigate to="/" />} />
        <Route path="/join-room" element={user ? <JoinRoom /> : <Navigate to="/" />} /> */}
        <Route path="/room/:roomId" element={user ? <Room /> : <Navigate to="/" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
