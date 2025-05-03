import { useId } from "react";

import { Input } from "@/components/ui/input";

export default function DashboardInput({value, placeholder, setinput, onKeyDown=() => {} }) {
  const id = useId();
  return (
    <div className="group relative">
      <label
        htmlFor={id}
        className="origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium"
      >
        <span className="bg-background inline-flex px-2 rounded-sm">
          {placeholder}
        </span>
      </label>
      <Input
        id={id}
        type="text"
        placeholder=" "
        autoComplete="off"
        className="py-5"
        value={value}
        onKeyDown={onKeyDown}
        onChange={(e) => setinput(e.target.value)}
      />
    </div>
  );
}
