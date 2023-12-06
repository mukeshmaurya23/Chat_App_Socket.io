import React, { useState } from "react";
import Modal from "./Modal";
import { useUserNameContext } from "../context/UserContext";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const { setUserName, userName } = useUserNameContext();
  const [userNames, setUserNames] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setUserName(userNames);
      setIsModalOpen(false);
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center mt-[10rem]">
        <img
          className="w-[8%]"
          src="https://img.icons8.com/external-kiranshastry-lineal-color-kiranshastry/64/external-chat-business-and-management-kiranshastry-lineal-color-kiranshastry.png"
          alt="external-chat-business-and-management-kiranshastry-lineal-color-kiranshastry"
        />
        <div className="text-white text-center space-y-9 mt-5">
          <h1 className="text-4xl font-bold ">Chat App</h1>
          <p className="text-2xl">Welcome to Chat App</p>
          <button
            className="bg-primary text-white px-4 py-2 rounded-md"
            onClick={userName ? () => {} : toggleModal}
          >
            {userName ? `Welcome ${userName}` : "Get Started"}
          </button>
        </div>
      </div>
      <Modal
        setIsModalOpen={setIsModalOpen}
        isOpen={isModalOpen}
        onClose={toggleModal}
      >
        <div className="flex flex-col justify-center items-center space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={userNames}
            onKeyPress={handleKeyPress}
            onChange={(e) => setUserNames(e.target.value)}
            className="border border-gray-400 px-4 py-2 rounded-md"
          />

          <button
            className="bg-primary text-white px-4 py-2 rounded-md"
            onClick={() => {
              setUserName(userNames);
              setIsModalOpen(false);
            }}
          >
            Submit Username
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Home;
