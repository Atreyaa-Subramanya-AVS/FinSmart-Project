"use client";

import { useRouter } from "next/navigation";
import EmailInput from "@/components/comp-10";
import SignInUI from "@/components/comp-122";
import { Button } from "@/components/ui/button";
import PasswordStrengthIndicator from "@/components/password";
import React, { useState, useEffect } from "react";
import signin from "../../public/images/signin.jpg";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import signinBG from "../../public/images/signinBG.png";

const Page = () => {
  const router = useRouter();

  const [option, setOption] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [allow, setAllow] = useState(false);

  // useEffect(() => {
  //   const loggedInUser = localStorage.getItem("username");
  //   if (loggedInUser) {
  //     router.push("/dashboard");
  //   }
  // }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (option === "Register" && !allow) {
      toast.error("Please use a stronger password.");
      return;
    }

    const endpoint =
      option === "Register"
        ? "http://localhost:5000/auth/local/register"
        : "http://localhost:5000/auth/local/login";

    const payload =
      option === "Register"
        ? { username: name, email, password }
        : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || `${option} failed`);

      // Save to localStorage (optional or adjust to use JWT/session)
      localStorage.setItem("username", data.username || name);
      localStorage.setItem("email", data.email || email);

      toast.success(
        option === "Register"
          ? `Welcome, ${data.username || name}! 🎉`
          : `Welcome back, ${data.username || name}!`
      );

      // Redirect to dashboard
      router.push("/dashboard?refresh=true");
    } catch (err) {
      toast.error(err.message || "Authentication failed.");
    }
  };

  return (
    <div className="h-fit w-full flex justify-center items-center text-white">
      <Toaster />
      <div
        className="absolute top-0 left-0 w-full h-[150%] xl:h-screen flex -z-10 brightness-90"
        style={{
          backgroundImage: `url(${signinBG.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <div className="wrapper absolute max-md:top-3/4 top-3/4 xl:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-screen-lg w-3/4 px-12 py-4 border border-dashed lg:flex justify-between gap-12 bg-[rgba(0,0,0,0.5)] rounded-md">
        <div className="w-1/2 max-lg:w-full flex flex-col gap-2">
          <h1 className="text-center text-5xl font-bold mt-3 tracking-tight">
            {option}
          </h1>
          <p className="text-sm text-center my-4 font-light">
            {option} to access real-time market data, AI-powered insights, and a
            personalized dashboard.
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
            setAllow={setAllow}
          />

          <div className="flex justify-center my-6">
            <Button type="submit" className="px-6 py-2">
              {option}
            </Button>
          </div>

          <div className="text-sm text-center text-neutral-300 mb-2">
            Or continue with
          </div>

          <SignInUI />
        </form>
      </div>
    </div>
  );
};

export default Page;
