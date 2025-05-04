import { useId, useState, useEffect } from "react";
import { OTPInput } from "input-otp";
import { MinusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function SigninOTP({ setEmailToParent, showOTP }) {
  const id = useId();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [resetTimer, setResetTimer] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth/user", {
        withCredentials: true,
      });

      console.log("Response from /auth/user:", response.data);

      if (response.status === 200) {
        const { username, email, profilePicture } = response.data;

        setUsername(username);
        setEmail(email);
        setProfilePicture(profilePicture);
        setEmailToParent(email);

        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("profilePicture", profilePicture);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedPicture = localStorage.getItem("profilePicture");

    if (storedUsername && storedEmail && storedPicture) {
      setUsername(storedUsername);
      setEmail(storedEmail);
      setProfilePicture(storedPicture);
      setEmailToParent(storedEmail);
    }

    fetchUserData();
  }, []);

  useEffect(() => {
    let timer;

    if (showOTP || resetTimer) {
      setTimeLeft(120);
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [showOTP, resetTimer]);

  const handleResendOTP = async () => {
    try {
      setResetTimer(true);
      setTimeLeft(120);

      const response = await fetch("http://localhost:5000/auth/otp/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Use the email from the form or state
      });

      console.log("Resend OTP: ", email);

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      toast.success("OTP resent successfully!");

      // Reset resetTimer to false after a short delay to stop triggering countdown
      setTimeout(() => setResetTimer(false), 100);
    } catch (err) {
      toast.error(err.message || "Failed to resend OTP.");
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6 || !email || timeLeft === 0) {
      toast.error("Invalid OTP, missing email, or OTP expired");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/auth/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      toast.success("OTP verified!");
      router.push("http://localhost:3000/dashboard?refresh=true");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="*:not-first:mt-2 flex flex-col">
      <Label htmlFor={id} className="text-neutral-200 text-center text-base">
        An OTP has been sent to <br />
        <div className="flex w-fit mx-auto p-3 gap-3 bg-neutral-500 rounded-lg my-2 scale-90">
          <img
            src={profilePicture}
            alt="profilePic"
            className="w-10 h-10 rounded-full my-auto"
          />
          <div className="flex flex-col">
            <h1 className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
              {username}
            </h1>
            <h2 className="underline text-sm">{email || "your email"}</h2>
          </div>
        </div>
      </Label>

      {showOTP && (
        <div className="text-sm text-center mt-2">
          {timeLeft > 0 ? (
            <span className="text-neutral-300">
              OTP expires in:{" "}
              <span className="font-semibold">
                {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                {String(timeLeft % 60).padStart(2, "0")}
              </span>
            </span>
          ) : (
            <span className="text-red-500 font-semibold">
              OTP has been Expired! Click on resend otp button.
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col mx-auto justify-center items-center">
        <OTPInput
          id={id}
          containerClassName="flex gap-3 has-disabled:opacity-50 my-5 "
          maxLength={6}
          value={otp}
          onChange={(val) => setOtp(val)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && otp.length === 6 && timeLeft > 0) {
              handleVerifyOTP();
            }
          }}
          render={({ slots }) => (
            <>
              <div className="flex">
                {slots.slice(0, 3).map((slot, idx) => (
                  <Slot key={idx} {...slot} />
                ))}
              </div>

              <div className="text-white my-auto">
                <MinusIcon size={16} aria-hidden="true" />
              </div>

              <div className="flex">
                {slots.slice(3).map((slot, idx) => (
                  <Slot key={idx} {...slot} />
                ))}
              </div>
            </>
          )}
        />
        <Button
          onClick={handleVerifyOTP}
          disabled={isLoading || otp.length < 6 || timeLeft === 0}
        >
          {isLoading ? "Verifying..." : "Submit"}
        </Button>
        <p className="text-center text-sm mt-2">
          Didn't Receive?{" "}
          <span
            className={`underline cursor-pointer ${
              isLoading || timeLeft > 0 ? "text-gray-500" : "text-white"
            }`}
            onClick={isLoading || timeLeft > 0 ? null : handleResendOTP}
            style={{
              cursor: isLoading || timeLeft > 0 ? "not-allowed" : "pointer",
            }}
          >
            Resend OTP
          </span>
        </p>
      </div>
    </div>
  );
}

function Slot(props) {
  return (
    <div
      className={cn(
        "border-input bg-background text-foreground relative -ms-px flex size-9 items-center justify-center border font-medium shadow-xs transition-[color,box-shadow] first:ms-0 first:rounded-s-md last:rounded-e-md",
        { "border-ring ring-ring/50 z-10 ring-[3px]": props.isActive }
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}