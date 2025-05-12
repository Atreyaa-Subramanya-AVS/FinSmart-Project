"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useId, useMemo, useState, useEffect } from "react";

export default function PasswordStrengthIndicator({
  setAllow,
  option,
  password,
  setPassword,
}) {
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[0-9]/, text: "At least 1 number" },
    { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    { regex: /[!@#$%^&*(),.?":{}|<>]/, text: "At least 1 special character" },
    { regex: /^(?=\S+$).+$/, text: "No spaces or whitespace characters" },
  ];

  const checkStrength = (pass) => {
    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password || "");

  const totalRequirements = requirements.length;

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  useEffect(() => {
    const percentage = (strengthScore / totalRequirements) * 100;
    setAllow(percentage >= 90);
  }, [strengthScore, totalRequirements, setAllow]);

  const getStrengthText = (score) => {
    if (score === 0) return "Enter a password";

    const percentage = (score / totalRequirements) * 100;

    if (percentage < 40) return "Very Weak password";
    if (percentage < 60) return "Weak password";
    if (percentage < 80) return "Medium password";
    if (percentage < 90) return "Strong password";
    return "Very Strong password";
  };

  const getStrengthColor = (score) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score <= 3) return "bg-amber-300";
    if (score === 4) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div>
      {/* Password input field with toggle visibility button */}
      <div className="space-y-2">
        <Label className="text-white" htmlFor={id}>
          Password:
        </Label>
        <div className="relative">
          <Input
            id={id}
            className="pe-9"
            placeholder="Password"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={strengthScore < 4}
            aria-describedby={`${id}-description`}
          />
          <button
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            aria-controls="password"
          >
            {isVisible ? (
              <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Eye size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {option !== "Login" && (
        <>
          {/* Password strength indicator */}
          <div
            className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
            role="progressbar"
            aria-valuenow={strengthScore}
            aria-valuemin={0}
            aria-valuemax={4}
            aria-label="Password strength"
          >
            <div
              className={`h-full ${getStrengthColor(
                strengthScore
              )} transition-all duration-500 ease-out`}
              style={{ width: `${(strengthScore / 5) * 100}%` }}
            ></div>
          </div>
          {/* Password strength description */}
          <p
            id={`${id}-description`}
            className="mb-2 text-sm font-medium text-neutral-200"
          >
            {getStrengthText(strengthScore)}. Must contain:
          </p>
          {/* Password requirements list */}
          <ul className="space-y-1.5 " aria-label="Password requirements">
            {strength.map((req, index) => (
              <li key={index} className="flex items-center gap-2">
                {req.met ? (
                  <Check
                    size={16}
                    className="text-emerald-500"
                    aria-hidden="true"
                  />
                ) : (
                  <X
                    size={16}
                    className="text-neutral-200"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`text-xs  ${
                    req.met ? "text-emerald-400" : "text-neutral-200"
                  }`}
                >
                  {req.text}
                  <span className="sr-only">
                    {req.met ? " - Requirement met" : " - Requirement not met"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
