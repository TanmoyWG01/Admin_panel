import React from 'react';
import './chatWindow.css';

import { IoIosAddCircleOutline } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import { IoSend } from "react-icons/io5";


const ChatWindow = () => {
  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Anna Doe</h3>
      </div>
      <div className="chat-messages">
        <div className="message received">Hello! How can I help you today?</div>
        <div className="message sent">I'm having an issue with my account.</div>
        {/* Add more messages */}
      </div>
      <div className="chat-input">
        <IoIosAddCircleOutline className='SentDocumets'/>
        <input type="text" placeholder="Type a message..." />
        <BsEmojiSmile className='emojiIcon'/>
        <button><IoSend className='sentIcon'/></button>
      </div>
    </div>
  );
};

export default ChatWindow;
