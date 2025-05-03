import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardDropDown({ setSampleData }) {
  const [selectedLabel, setSelectedLabel] = useState("Add Sample Data");

  const handleSelect = (label) => {
    setSelectedLabel(label);
    setSampleData(label);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="z-0">
          <Button variant="outline">
            {selectedLabel}
            <ChevronDownIcon
              className="-me-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[--radix-dropdown-menu-trigger-width]">
        <DropdownMenuItem
          onClick={() => handleSelect("Erase Data")}
          className="cursor-pointer"
        >
          Erase Data
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSelect("Sample Data 1")}
          className="cursor-pointer"
        >
          Sample Data 1
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSelect("Sample Data 2")}
          className="cursor-pointer"
        >
          Sample Data 2
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSelect("Sample Data 3")}
          className="cursor-pointer"
        >
          Sample Data 3
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
