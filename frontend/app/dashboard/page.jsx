import Chatbot from "@/components/Dashboard Components/Chatbot";
import Home from "@/components/Dashboard Components/Home";
import ML from "@/components/Dashboard Components/ML";
import Profile from "@/components/Profile";
import VerticalTab from "@/components/VerticalTabs";
import Link from "next/link";
import React from "react";
import Details from "@/components/Dashboard Components/Details";

const Dashboard = () => {
  return (
    <div className="min-h-screen text-white bg-black absolute inset-0 
  ">
      <div className="wrapper bg-black flex">
        <div className="flex justify-between w-fit mx-auto bg-gradient-to-r from-black via-red-900 to-black
 py-2 rounded-md my-2 gap-48 items-center max-lg:gap-32 max-md:gap-16 px-12 max-sm:gap-48 border border-[#ddd]">
          <div>
            <Link href={"/"}>
              <h1 className="whitespace-nowrap">Meco Inc.</h1>
            </Link>
          </div>
          <div className="max-sm:hidden">
            <h1 className="whitespace-nowrap">Welcome, User!</h1>
          </div>
          <div>
            <Profile />
          </div>
        </div>
      </div>
      <div className="h-auto bg-black">
        <VerticalTab
          tabComponents={{
            "tab-1": <Home />,
            "tab-2": <Details />,
            "tab-3": <ML />,
            "tab-4": <Chatbot />,
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
