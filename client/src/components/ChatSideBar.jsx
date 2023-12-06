import React, { useEffect, useState } from "react";
import { BiMessageRounded } from "react-icons/bi";
import { useUserNameContext } from "../context/UserContext";
import io from "socket.io-client";
import { enqueueSnackbar } from "notistack";
const socket = io.connect("http://localhost:8000");
const ChatSideBar = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { userName } = useUserNameContext();

  useEffect(() => {
    socket.on("receive_message", (messageData) => {
      console.log(messageData, "messageData");
      setMessages([...messages, messageData]);
      setIsTyping(false);
    });
    socket.on("typing", (data) => {
      setIsTyping(true);
    });
  }, [messages, socket, isTyping]);
  console.log(messages, "messages");
  const handleSubmit = (e) => {
    e.preventDefault();

    sendMessage();
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    } else {
      socket.emit("typing", { user: userName });
    }
  };
  const sendMessage = () => {
    const time = new Date();
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const meridiem = `${time.getHours() > 12 ? "PM" : "AM"}`;
    const addLeadingZero = (value) => (value < 10 ? `0${value}` : value);

    const formattedTime = `${addLeadingZero(hour)}:${addLeadingZero(
      minutes
    )} ${meridiem}`;
    const messageData = {
      message: newMessage,
      user: userName,
      time: formattedTime,
      // time:
      //   new Date(Date.now()).getHours() +
      //   ":" +
      //   new Date(Date.now()).getMinutes(),
    };

    if (newMessage === "") {
      enqueueSnackbar("Message can't be empty", {
        variant: "error",
      });
      return;
    }

    socket.emit("send_message", messageData);

    // enqueueSnackbar("Message Sent Successfully", {
    //   autoHideDuration: 2000,
    //   variant: "success",
    // });

    setNewMessage("");
    setIsTyping(false);
  };
  console.log(isTyping, "isTyping");
  return (
    <div>
      <div className="space-y-2 max-h-[560px] overflow-y-auto">
        {messages?.map((message) => (
          <div
            key={message.id} // Add a unique key for each message
            className={`flex gap-4 items-center ${
              message.user === userName ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                message.user === userName
                  ? "bg-messageColor text-gray-300 font-semibold"
                  : "bg-blueChat text-white"
              } px-2 mx-5 my-2 py-2 rounded-md min-w-[130px] max-w-[80%]`}
            >
              {message.user === userName ? (
                <p className="text-xs">You</p>
              ) : (
                <p className="text-xs">{message.user}</p>
              )}
              <p className="text-sm">{message.message}</p>
              <div className="text-gray-200  text-xs text-end">
                {message.time}
              </div>
              {/* <p className="text-xs">{message.time}</p> Remove this line from here */}
            </div>
          </div>
        ))}
        {isTyping && !messages.some((message) => message.user === userName) && (
          <div className="flex gap-4 items-center justify-start">
            <div className="bg-blueChat text-white px-2 mx-5 my-2 py-2 rounded-md min-w-[130px] max-w-[80%]">
              <p className="text-sm">Typing...</p>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-[10%] w-[88%]">
        {/**bg-primary border-r border-l h-screen w-1/6 */}
        {/* <div className="flex justify-between items-center border-b">
        <h2 className="text-white text-[20px] px-5 py-4 ">Chats</h2>
        <div className="text-white text-[20px] px-5 py-4 ">
          <BiMessageRounded />
        </div>
      </div> */}
        <div className="flex flex-col justify-end p-5">
          <div className="flex items-end justify-end gap-3">
            <input
              type="text"
              placeholder="Type a message"
              value={newMessage}
              onKeyPress={handleKeyPress}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full px-4 py-2 border-2 bg-gray-300 border-blue-400 rounded-md  hover:border-blue-500 focus:border-blue-500 focus:outline-none"
            />
            <button
              className="bg-blueChat text-white  rounded-md px-6 py-2"
              onClick={handleSubmit}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSideBar;
