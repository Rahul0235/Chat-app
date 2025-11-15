import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || "");
      setBio(authUser.bio || "");
    }
  }, [authUser]);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let profilePic = null;
      if (selectedImg) {
        profilePic = await convertToBase64(selectedImg);
      }

      await updateProfile({
        fullName: name,
        bio,
        profilePic
      });
      
      navigate("/");
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a temporary preview URL safely
  const avatarPreview = selectedImg 
    ? URL.createObjectURL(selectedImg) 
    : authUser?.profilePic || assets.avatar_icon;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl backdrop-blur-2xl bg-[#1b1b2f]/60 border border-gray-700
                   text-gray-300 rounded-2xl shadow-xl flex items-center justify-between
                   max-sm:flex-col-reverse transition-all duration-300"
      >
        {/* Left Side Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-xl font-semibold text-white">Profile Details</h3>

          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              onChange={(e) => setSelectedImg(e.target.files[0])}
              hidden
            />
            <img
              src={avatarPreview}
              alt="Avatar"
              className={`w-12 h-12 object-cover ${selectedImg ? "rounded-full" : ""}`}
            />
            <span>Upload Profile Image</span>
          </label>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="p-2 border border-gray-500 rounded-md bg-transparent text-white
                       focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            placeholder="Write profile bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            rows={4}
            className="p-2 border border-gray-500 rounded-md bg-transparent text-white
                       focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white
                       p-2 rounded-full text-lg cursor-pointer hover:opacity-90 transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>

        {/* Right Side Logo */}
        <div className="flex justify-center items-center p-10">
          <img
            src={assets.logo_icon}
            alt="Logo"
            className="max-w-[11rem] aspect-square rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
