import ChatWindow from "../../ChatUi/ChatWindow/ChatWindow";
import Sidebar from "../../ChatUi/Sidebar/Sidebar";
import Header from "../../ChatUi/Header/Header";
import "./chat.css";

const Chat = () => {
    return (
    <>
     <div className="app">
      <Header />
      <div className="main">
        <Sidebar />
        <ChatWindow />
      </div>
    </div>
    </>
    );
}

export default Chat;
