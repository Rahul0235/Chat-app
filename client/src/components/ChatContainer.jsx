import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { AuthContext } from '../context/AuthContext'

const ChatContainer = ({selectedUser, setSelectedUser}) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const { getMessages, sendMessage, authUser, socket, onlineUsers } = useContext(AuthContext);
  const scrollEnd = useRef();
  const fileInputRef = useRef();

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({behavior: "smooth"});
    }
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        if (message.senderId === selectedUser?._id) {
          setMessages(prev => [...prev, message]);
        }
      });

      return () => socket.off("newMessage");
    }
  }, [socket, selectedUser]);

  const fetchMessages = async () => {
    if (!selectedUser) return;
    const result = await getMessages(selectedUser._id);
    if (result.success) {
      setMessages(result.messages);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() && !selectedImage) return;

    let imageBase64 = null;
    if (selectedImage) {
      imageBase64 = await convertToBase64(selectedImage);
    }

    const messageData = {
      text: messageText,
      image: imageBase64
    };

    const result = await sendMessage(selectedUser._id, messageData);
    if (result.success) {
      setMessages(prev => [...prev, result.message]);
      setMessageText("");
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const isOnline = onlineUsers.includes(selectedUser?._id);

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      {/* ----Header---- */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full'/>
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser?.fullName}
          {isOnline && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7'/>
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5'/>
      </div>
      {/* ----Chat Area---- */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
         {messages.map((msg, index)=>{
           const isMyMessage = msg.senderId === authUser?._id;
           return (
            <div key={msg._id || index} className={`flex items-end gap-2 mb-4 ${
              isMyMessage ? 'justify-end' : 'justify-start'
            }`}>
              {!isMyMessage && (
                <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-7 rounded-full'/>
              )}
              <div className={`flex flex-col max-w-[70%] ${
                isMyMessage ? 'items-end' : 'items-start'
              }`}>
                {msg.image ? (
                  <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden'/>
                ) : (
                  <p className={`p-3 rounded-lg break-words ${
                    isMyMessage 
                      ? 'bg-violet-500 text-white rounded-br-none' 
                      : 'bg-gray-700 text-white rounded-bl-none'
                  }`}>
                    {msg.text}
                  </p>
                )}
                <p className='text-xs text-gray-400 mt-1'>{formatMessageTime(msg.createdAt)}</p>
              </div>
              {isMyMessage && (
                <img src={authUser?.profilePic || assets.avatar_icon} alt="" className='w-7 rounded-full'/>
              )}
            </div>
           );
         })}
         <div ref={scrollEnd}></div>
      </div>

    {/* -----Bottom Area---- */}
    <form onSubmit={handleSendMessage} className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
       <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'> 
        <input 
          type="text" 
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Send a message" 
          className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent'
        />
        <input 
          ref={fileInputRef}
          type="file" 
          id='image' 
          accept='image/png, image/jpeg, image/jpg' 
          onChange={handleImageSelect}
          hidden
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer'/>
        </label>
       </div>
       <button type="submit">
         <img src={assets.send_button} alt="" className='w-7 cursor-pointer'/>
       </button>
       {selectedImage && (
         <div className='absolute bottom-full left-3 mb-2 p-2 bg-gray-800 rounded-lg'>
           <p className='text-white text-xs mb-2'>Image selected: {selectedImage.name}</p>
           <button 
             type="button" 
             onClick={() => {
               setSelectedImage(null);
               if (fileInputRef.current) fileInputRef.current.value = "";
             }}
             className='text-red-400 text-xs'
           >
             Remove
           </button>
         </div>
       )}
    </form>

    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} alt="" className='max-w-16'/>
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer
