import React from "react";
import icon from "../assets/icon.png";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { HiOutlineUserGroup } from "react-icons/hi";
import { Link, Outlet } from "react-router-dom";
import { useUserNameContext } from "../context/UserContext";
const SideBar = () => {
  const { userName } = useUserNameContext();
  return (
    <div className="flex">
      <aside className="bg-primary h-screen w-[10%]">
        <div className="flex flex-col justify-center items-center space-y-16 p-5">
          <div>
            <Link to="/">
              <img
                src={icon}
                alt="icon"
                className="w-16 mx-auto bg-blueChat mix-blend-color-dodge rounded-full"
              />
            </Link>
          </div>

          {userName && (
            <>
              <div className="text-white text-3xl">
                <Link to="/chat">
                  <IoChatbubbleEllipsesOutline />
                </Link>
              </div>
              <div className="text-white text-3xl">
                <Link to="/groupchat">
                  <HiOutlineUserGroup />
                </Link>
              </div>
            </>
          )}
        </div>
      </aside>
      <main className="flex-1 bg-secondary">
        <Outlet />
      </main>
    </div>
  );
};

export default SideBar;
