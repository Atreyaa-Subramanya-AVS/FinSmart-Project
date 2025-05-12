import { Button } from "@/components/ui/button";
import { RiGithubFill, RiGoogleFill } from "@remixicon/react";

export default function Component({ setGoogleLogin }) {
  const handleGoogleLogin = () => {
    window.location.href = "https://finsmart-backend-380l.onrender.com/auth/google"; // Redirect to backend Google OAuth
    setGoogleLogin(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleGoogleLogin}
        className="bg-[#DB4437] text-white flex items-center gap-2 hover:bg-[#DB4437]/90"
      >
        <RiGoogleFill className="opacity-60" size={16} aria-hidden="true" />
        Login with Google
      </Button>
    </div>
  );
}
