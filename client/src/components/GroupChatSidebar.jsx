import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { enqueueSnackbar } from "notistack";
import io from "socket.io-client";
import { useUserNameContext } from "../context/UserContext";

const socket = io.connect("http://localhost:8000");
const GroupChatSidebar = () => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [groups, setGroups] = useState([]); // [{groupName, groupDescription}
  // console.log(groups, "groups");
  // const [groupData, setGroupData] = useState({
  //   groupName: "",
  //   groupDescription: "",
  // });
  // const { userName } = useUserNameContext();

  // const toggleModal = () => {
  //   setIsModalOpen(!isModalOpen);
  // };
  // const handleCreateGroup = (groupData) => {
  //   const { groupName, groupDescription } = groupData;
  //   socket.emit("create_group", { groupName, groupDescription });
  // };
  // socket.on("group_created", (group) => {
  //   console.log(group, "group");
  //   setGroups([...groups, group]);
  // });
  // const handleGroupHandler = (e) => {
  //   e.preventDefault();
  //   if (groupData.groupName === "" || groupData.groupDescription === "") {
  //     enqueueSnackbar("Please fill all the fields", {
  //       variant: "error",
  //     });
  //   } else {
  //     handleCreateGroup(groupData);
  //     enqueueSnackbar("Group Created Successfully", {
  //       autoHideDuration: 2000,
  //       variant: "success",
  //     });

  //     setGroupData({ groupName: "", groupDescription: "" });
  //     setIsModalOpen(false);
  //   }
  // };
  // const handleJoinGroup = (groupId) => (e) => {
  //   e.preventDefault();
  //   console.log(groupId, "groupId");
  //   socket.emit("join_group", { groupId, userName });
  // };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupData, setGroupData] = useState({
    groupName: "",
    groupDescription: "",
  });
  const [groupMessages, setGroupMessages] = useState({});
  const [messageText, setMessageText] = useState("");
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const { userName } = useUserNameContext();
  const [isUserJoined, setIsUserJoined] = useState(false);
  console.log(groupMessages, "groupMessages");
  useEffect(() => {
    // Listen for group creation events
    socket.on("group_created", (group) => {
      setGroups([...groups, group]);
    });

    socket.on("receive_group_message", (messageData) => {
      console.log(messageData, "messageData");
      setGroupMessages({
        ...groupMessages,
        [messageData.groupId]: [
          ...(groupMessages[messageData.groupId] || []),
          messageData.message,
        ],
      });
    });

    // Listen for new messages

    // Cleanup on component unmount
    return () => {
      socket.off("group_created");
      socket.off("message_received");
    };
  }, [groups, groupMessages, socket]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCreateGroup = (groupData) => {
    const { groupName, groupDescription } = groupData;
    socket.emit("create_group", { groupName, groupDescription });
  };

  const handleGroupHandler = (e) => {
    e.preventDefault();
    if (groupData.groupName === "" || groupData.groupDescription === "") {
      enqueueSnackbar("Please fill all the fields", {
        variant: "error",
      });
    } else {
      handleCreateGroup(groupData);
      enqueueSnackbar("Group Created Successfully", {
        autoHideDuration: 2000,
        variant: "success",
      });
      setGroupData({ groupName: "", groupDescription: "" });
      setIsModalOpen(false);
    }
  };

  const handleJoinGroup = (groupId) => (e) => {
    e.preventDefault();
    const userData = {
      groupId,
      userName,
    };
    socket.emit("join_group", userData);
    setCurrentGroupId(groupId);
    setIsUserJoined(true);
    enqueueSnackbar("Joined Group Successfully", {
      autoHideDuration: 2000,
      variant: "success",
    });
  };

  const handleMessageSend = () => {
    const time = new Date();
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const meridiem = `${time.getHours() > 12 ? "PM" : "AM"}`;
    const addLeadingZero = (value) => (value < 10 ? `0${value}` : value);

    const formattedTime = `${addLeadingZero(hour)}:${addLeadingZero(
      minutes
    )} ${meridiem}`;
    if (messageText.trim() !== "") {
      socket.emit("send_group_message", {
        groupId: currentGroupId,
        message: { text: messageText, sender: userName, time: formattedTime },
      });
      setMessageText("");
    }
  };

  const keyPressHandler = (e) => {
    if (e.key === "Enter") {
      handleMessageSend();
    }
  };

  return (
    <>
      <div>
        {/* Display messages */}
        <div className="space-y-2 max-h-[560px] overflow-y-auto pl-[16rem]">
          {groupMessages[currentGroupId]?.map((message) => (
            <div
              key={message.id} // Add a unique key for each message
              className={`flex gap-4 items-center ${
                message.sender === userName ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  message.sender === userName
                    ? "bg-messageColor text-gray-300 font-semibold"
                    : "bg-blueChat text-white"
                } px-2 mx-5 my-2 py-2 rounded-md min-w-[130px] max-w-[80%]`}
              >
                {message.sender === userName ? (
                  <p className="text-xs">You</p>
                ) : (
                  <p className="text-xs">{message.sender}</p>
                )}
                <p className="text-sm">{message.text}</p>
                <div className="text-gray-200  text-xs text-end">
                  {message.time}
                </div>
                {/* <p className="text-xs">{message.time}</p> Remove this line from here */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-primary fixed top-0  border-r border-l h-screen w-1/6">
        <div className=" border-b">
          <h2 className="text-white text-[20px] px-5 py-4 ">Group Chats</h2>
        </div>
        <div className="flex  justify-between px-4 py-2 items-center border-b ">
          <h2 className="text-gray-400 text-[16px] ">Create Group</h2>
          <button
            className="bg-secondary text-white  rounded-md px-4 py-3"
            onClick={toggleModal}
          >
            +
          </button>
        </div>
        <div className="flex flex-col justify-center items-center space-y-2 p-5 cursor-pointer">
          {/**map data here */}
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-secondary w-full rounded-md px-4 py-2"
            >
              <h2 className="text-white text-[16px] ">{group.name}</h2>
              <p className="text-gray-400 text-[16px] ">{group.description}</p>
              <button
                className="bg-blueChat text-white w-full rounded-md px-4 py-2 mt-1"
                onClick={
                  isUserJoined && currentGroupId === group.id
                    ? () => {
                        enqueueSnackbar("Already Joined", {
                          autoHideDuration: 2000,
                          variant: "warning",
                        });
                      }
                    : handleJoinGroup(group.id)
                }
              >
                {isUserJoined && currentGroupId === group.id
                  ? "Joined"
                  : "Join"}
              </button>
            </div>
          ))}
        </div>

        <div className="fixed left-[27%] w-[72%] bottom-2">
          {isUserJoined && (
            <div className="flex gap-4 items-center justify-start">
              <input
                type="text"
                placeholder="Type a message"
                value={messageText}
                onKeyPress={keyPressHandler}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full px-4 py-2 border-2 bg-gray-300 border-blue-400 rounded-md  hover:border-blue-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                className="bg-blueChat text-white  rounded-md px-6 py-2"
                onClick={handleMessageSend}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        setIsModalOpen={setIsModalOpen}
        isOpen={isModalOpen}
        onClose={toggleModal}
      >
        <form className="flex flex-col justify-center items-center space-y-5">
          <input
            type="text"
            placeholder="Group Name"
            value={groupData.groupName}
            onChange={(e) =>
              setGroupData({ ...groupData, groupName: e.target.value })
            }
            className="border border-gray-400 px-4 py-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Group Description"
            value={groupData.groupDescription}
            onChange={(e) =>
              setGroupData({ ...groupData, groupDescription: e.target.value })
            }
            className="border border-gray-400 px-4 py-2 rounded-md"
          />
          <button
            className="bg-secondary text-white px-4 py-2 rounded-md"
            onClick={handleGroupHandler}
          >
            Create
          </button>
        </form>
      </Modal>
    </>
  );
};

export default GroupChatSidebar;
