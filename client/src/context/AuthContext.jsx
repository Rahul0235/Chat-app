import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true; 
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const setAxiosToken = (token) => {
    if (token) axios.defaults.headers.common["token"] = token;
    else delete axios.defaults.headers.common["token"];
  };

  const checkAuth = async () => {
    if (!token) return;
    setAxiosToken(token);
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(token);
      } else logout();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      logout();
    }
  };

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setAxiosToken(data.token);
        connectSocket(data.token);
        toast.success(data.message);
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    setAxiosToken(null);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    toast.success("Logged out successfully");
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const connectSocket = (jwtToken) => {
    if (!jwtToken) return;
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    const newSocket = io(backendUrl, {
      auth: { token: jwtToken },
      withCredentials: true
    });

    newSocket.on("connect", () => console.log("Socket connected:", newSocket.id));
    newSocket.on("getOnlineUsers", (users) => setOnlineUsers(users));
    newSocket.on("disconnect", () => console.log("Socket disconnected"));
    newSocket.on("connect_error", (error) => toast.error(error.message));

    setSocket(newSocket);
  };

  useEffect(() => {
    checkAuth();
    return () => { if (socket) socket.disconnect(); };
  }, []);

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      return { success: false };
    }
  };

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      return { success: false };
    }
  };

  const sendMessage = async (userId, messageData) => {
    try {
      const { data } = await axios.post(`/api/messages/send/${userId}`, messageData);
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      return { success: false };
    }
  };

  const markAsSeen = async (messageId) => {
    try {
      const { data } = await axios.put(`/api/messages/mark/${messageId}`);
      return data;
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
        getUsers,
        getMessages,
        sendMessage,
        markAsSeen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
