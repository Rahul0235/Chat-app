import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(null); // null is better than false

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0e0e14] via-[#151528] to-[#1e1b3a] p-4">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden
                    h-[90vh] w-full max-w-7xl grid grid-cols-1 relative transition-all duration-300
                    ${selectedUser
                      ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
                      : "md:grid-cols-2"}`}
      >
        {/* Sidebar */}
        <Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

        {/* Chat Container */}
        <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

        {/* Right Sidebar only when a user is selected */}
        {selectedUser && (
          <RightSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
