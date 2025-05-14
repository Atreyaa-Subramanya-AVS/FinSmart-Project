"use client";

import { useRouter } from "next/navigation";
import EmailInput from "@/components/comp-10";
import SignInUI from "@/components/comp-122";
import { Button } from "@/components/ui/button";
import PasswordStrengthIndicator from "@/components/password";
import React, { useState, useEffect, useRef } from "react";
import signin from "../../public/images/signin.jpg";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import signinBG from "../../public/images/signinBG.png";
import SigninOTP from "@/components/SigninOTP";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

const PageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [option, setOption] = useState("Login");
  const [name, setName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [allow, setAllow] = useState(false);
  const [showOTPScreen, setShowOTPScreen] = useState(false);
  const [googleLogin, setGoogleLogin] = useState(false);

  useEffect(() => {
    const showOTPParam = searchParams.get("showOTP");
    if (showOTPParam === "true") {
      setShowOTPScreen(true);

      // Clean the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("showOTP");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!googleLogin) {
      if (option === "Register" && !allow) {
        toast.error("Please use a stronger password.");
        return;
      }
    }

    const endpoint =
    option === "Register"
    ? `https://finsmart-backend-380l.onrender.com/auth/local/register`
    : `https://finsmart-backend-380l.onrender.com/auth/local/login`;


    const payload =
      option === "Register"
        ? { username: name, email: registerEmail, password: registerPassword }
        : { email: loginEmail, password: loginPassword };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || `${option} failed`);

      localStorage.setItem("ID", data.ID || null);
      localStorage.setItem("username", data.username || name);
      localStorage.setItem("email", data.email || email);
      localStorage.setItem("profilePicture", data.profilePicture);

      toast.success(
        option === "Register"
          ? `Welcome, ${data.username || name}! 🎉`
          : `Welcome back, ${data.username || name}!`
      );

      router.push("/dashboard?refresh=true");
    } catch (err) {
      if (!googleLogin) {
        toast.error(err.message || "Authentication failed.");
      }
    }
  };

  const resendOTP = async () => {
    try {
    const response = await fetch(`https://finsmart-backend-380l.onrender.com/auth/otp/resend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email }), // Use the email from the form or state
    });

      console.log("Resend OTP: ", email);

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      toast.success("OTP resent successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to resend OTP.");
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
            {option} to access stock market data, AI-powered insights, and a
            personalized dashboard.
          </p>
          <Image
            src={signin}
            className="max-md:hidden size-48 lg:size-80 rounded-full mx-auto object-cover"
            alt="signin"
          />
        </div>

        <div className="relative w-1/2 max-lg:w-full overflow-hidden min-h-1/2 my-auto">
          <AnimatePresence mode="wait">
            {!showOTPScreen ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col justify-center h-max w-full"
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
                  value={option === "Login" ? loginEmail : registerEmail}
                  onChange={
                    option === "Login" ? setLoginEmail : setRegisterEmail
                  }
                  required
                  className="mt-3"
                />

                <PasswordStrengthIndicator
                  option={option}
                  password={
                    option === "Login" ? loginPassword : registerPassword
                  }
                  setPassword={
                    option === "Login" ? setLoginPassword : setRegisterPassword
                  }
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

                <SignInUI setGoogleLogin={setGoogleLogin} />
              </motion.form>
            ) : (
              <div className="relative flex items-center justify-center bg-neutral-700 p-5 rounded-md max-lg:mt-12 max-lg:mb-5">
                <motion.div
                  key="otp"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full my-auto"
                >
                  <div className="flex flex-col gap-3 w-full">
                    <h1 className="text-xl md:text-2xl xl:text-3xl font-semibold text-center underline">
                      Enter OTP
                    </h1>
                    <SigninOTP
                      setEmailToParent={option == "Login" ? setLoginEmail : setRegisterEmail}
                      showOTP={showOTPScreen}
                    />
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PageClient;
