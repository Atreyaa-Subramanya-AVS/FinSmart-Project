import { Button } from "@/components/ui/button";
import { RiGithubFill, RiGoogleFill } from "@remixicon/react";

export default function Component() {  
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google"; // Redirect to backend Google OAuth
  };

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:5000/auth/github"; // Redirect to backend GitHub OAuth
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

      <Button 
        onClick={handleGitHubLogin} 
        className="bg-[#333333] text-white flex items-center gap-2 hover:bg-[#333333]/90"
      >
        <RiGithubFill className="opacity-60" size={16} aria-hidden="true" />
        Login with GitHub
      </Button>
    </div>
  );
}
