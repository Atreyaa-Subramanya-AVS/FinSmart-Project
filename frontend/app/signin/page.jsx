"use client";

import { useRouter } from "next/navigation";
import EmailInput from "@/components/comp-10";
import SignInUI from "@/components/comp-122";
import { Button } from "@/components/ui/button";
import PasswordStrengthIndicator from "@/components/password";
import React, { useState } from "react";
import signin from "../../public/images/signin.jpg";
import Image from "next/image";

const Page = () => {
  const router = useRouter();

  const [option, setOption] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log("Name: ",name);
    console.log("Email:", email);
    console.log("Password:", password);
    router.push("/dashboard"); // Navigate to Dashboard
  };

  return (
    <div className="h-fit w-full flex justify-center items-center text-white">
      <div className="absolute top-0 left-0 w-full h-[150%] lg:h-[150%] xl:h-screen flex -z-10 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>

      <div className="wrapper absolute max-md:top-3/4 top-3/4 xl:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-screen-lg w-3/4 px-12 py-4 border border-dashed lg:flex justify-between gap-12">
        <div className="w-1/2 max-lg:w-full flex flex-col gap-2">
          <h1 className="text-center text-5xl font-semibold mt-3 tracking-tight">
            {option}
          </h1>
          <p className="text-sm max-w-screen-md text-center my-4">
            {option} and take control of your investments with real-time market
            data, AI-driven stock insights, and a personalized dashboard—smart
            investing starts here!
          </p>
          <Image
            src={signin}
            className="max-md:hidden size-48 lg:size-80 rounded-full mx-auto object-cover"
            alt="signin"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center h-max w-1/2 mx-auto max-lg:w-full xl:my-auto"
        >
          <div className="option-wrapper bg-neutral-200 w-fit mx-auto p-2 rounded-md max-lg:mt-6">
            <div className="options flex justify-center">
              <Button
                type="button"
                onClick={() => setOption("Login")}
                className={`bg-neutral-300 text-black hover:bg-neutral-100 rounded-r-none ${
                  option === "Login" && "bg-white"
                }`}
              >
                Login
              </Button>
              <Button
                type="button"
                onClick={() => setOption("Register")}
                className={`bg-neutral-300 text-black hover:bg-neutral-100 rounded-l-none ${
                  option === "Register" && "bg-white"
                }`}
              >
                Register
              </Button>
            </div>
          </div>

          {option === "Register" && (
            <EmailInput
              placeholder="User Name"
              type="text"
              required
              className="mt-3"
              value={name}
              onChange={setName}
            />
          )}

          {/* Email Input */}
          <EmailInput
            placeholder="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
            className="mt-3"
          />

          <PasswordStrengthIndicator
            option={option}
            password={password}
            setPassword={setPassword}
          />

          <div className="flex justify-center my-6">
            <Button type="submit" className="px-6 py-2">
              Sign In
            </Button>
          </div>
          <SignInUI />
        </form>
      </div>
    </div>
  );
};

export default Page;
