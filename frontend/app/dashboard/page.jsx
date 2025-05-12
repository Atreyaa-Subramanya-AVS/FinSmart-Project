"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Chatbot from "@/components/Dashboard Components/Chatbot";
import Home from "@/components/Dashboard Components/Home";
import ML from "@/components/Dashboard Components/ML";
import Profile from "@/components/Profile";
import VerticalTab from "@/components/VerticalTabs";
import Link from "next/link";
import Details from "@/components/Dashboard Components/Details";
import FinancialAnalysis from "@/components/Dashboard Components/FinancialAnalysis";
import Logo from "../../public/valorant-3.svg";
import Image from "next/image";

const Dashboard = () => {
  const [ID, setID] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth/user", {
        withCredentials: true,
      });

      console.log("Response from /auth/user:", response.data);

      if (response.status === 200) {
        const { ID, username, email, profilePicture } = response.data;

        // Update state with the user data
        setID(ID);
        setUsername(username);
        setEmail(email);
        setProfilePicture(profilePicture);

        // Save data to localStorage
        localStorage.setItem("ID", ID);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("profilePicture", profilePicture);
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
      // Handle error (e.g., redirect to login if necessary)
    }
  };

  useEffect(() => {
    const storedID = localStorage.getItem("ID");
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedPicture = localStorage.getItem("profilePicture");

    if (storedID) setID(storedID);
    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
    if (storedPicture) setProfilePicture(storedPicture);

    fetchUserData();

    // Handle refresh query parameter
    const url = new URL(window.location.href);
    const shouldReload = url.searchParams.get("refresh");

    if (shouldReload === "true") {
      url.searchParams.delete("refresh");
      window.history.replaceState({}, "", url.toString());
      window.location.reload();
    }
  }, []);

  return (
    <div className="min-h-screen text-white bg-black absolute inset-0">
      <div className="wrapper bg-black flex">
        <div
          className="flex justify-between w-fit mx-auto bg-gradient-to-r from-black via-red-900 to-black rounded-md my-2 gap-48 items-center max-lg:gap-32 max-md:gap-16 px-12 max-sm:gap-48 border border-[#ddd]"
        >
          <div className="flex items-center gap-2">
            <Image src={Logo} alt="FinSmart Logo" width={50} height={50} />
            <Link href={"/"}>
              <h1 className="whitespace-nowrap font-semibold text-md lg:text-lg">
                FinSmart
              </h1>
            </Link>
          </div>
          <div className="max-sm:hidden">
            <h1 className="whitespace-nowrap font-semibold">
              Welcome,{" "}
              <span className="text-xl lg:text-2xl tracking-tight font-semibold pl-1">
                {username || ""}
              </span>
            </h1>
          </div>
          <div className="inline-flex items-center cursor-pointer">
            <Profile
              username={username}
              email={email}
              profilePicture={profilePicture}
            />
          </div>
        </div>
      </div>
      <div className="h-auto bg-black">
        <VerticalTab
          tabComponents={{
            "tab-1": <Home />,
            "tab-2": <Details />,
            "tab-3": <FinancialAnalysis />,
            "tab-4": <ML />,
            "tab-5": <Chatbot />,
          }}
          username={username}
          email={email}
          profilePicture={profilePicture}
        />
      </div>
    </div>
  );
};

export default Dashboard;
