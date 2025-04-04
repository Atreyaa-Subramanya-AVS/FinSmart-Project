import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleUserRound, Mail } from "lucide-react";
import { useId } from "react";

export default function Component({ placeholder, type, value, onChange }) {
  const id = useId();

  return (
    <div className="space-y-2">
      <Label className="text-white" htmlFor={id}>
        {placeholder}:
      </Label>
      <div className="relative">
        <Input
          id={id}
          className="peer pe-9"
          placeholder={placeholder}
          type={type}
          value={value} // ✅ Controlled input
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
          {type === "email" ? (
            <Mail size={16} strokeWidth={2} aria-hidden="true" />
          ) : (
            <CircleUserRound size={16} strokeWidth={2} aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}
