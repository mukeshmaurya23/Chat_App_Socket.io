import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SideBar from "./components/SideBar";
import Home from "./components/Home";
import ChatSideBar from "./components/ChatSideBar";
import GroupChatSidebar from "./components/GroupChatSidebar";
import { useUserNameContext } from "./context/UserContext";

const App = () => {
  const { userName } = useUserNameContext();

  return (
    <div>
      <Routes>
        <Route path="/" element={<SideBar />}>
          <Route path="/" element={<Home />} index={true} />

          {userName && <Route path="/chat" element={<ChatSideBar />} />}

          {userName && (
            <Route path="/groupchat" element={<GroupChatSidebar />} />
          )}
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
