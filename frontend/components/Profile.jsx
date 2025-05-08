"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ChevronDownIcon,
  LogOutIcon,
  PinIcon,
  UserPenIcon,
} from "lucide-react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Profile({ username, email, profilePicture }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="dark">
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            {/* Use the profile picture passed as a prop */}
            {profilePicture ? (
              <AvatarPrimitive.Root className="w-16 h-16 rounded-full overflow-hidden">
                <AvatarImage
                  className="light"
                  src={profilePicture}
                  alt="Profile image"
                />
              </AvatarPrimitive.Root>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-700 text-white flex items-center justify-center">
                A
              </div>
            )}

            <img src={profilePicture} alt="" />
            <AvatarFallback>{username?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium overflow-hidden text-ellipsis max-w-[150px]">
            {username}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            localStorage.removeItem("username");
            localStorage.removeItem("email");
            window.location.href = "/signin"; // 🔁 Redirect to login page
          }}
        >
          <LogOutIcon
            size={16}
            className="opacity-60 text-red-600 contrast-150"
            aria-hidden="true"
          />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
