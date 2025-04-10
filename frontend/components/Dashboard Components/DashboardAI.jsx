import React from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from "../ui/drawer";

const DashboardAI = () => {
  return (
    <div className="flex flex-col items-center justify-center py-5">
      <h1 className="text-2xl py-3 font-bold">Ask AI for Recommendations:</h1>
      <div>
        <Drawer>
          <DrawerTrigger asChild>
            <button className="px-4 py-2 bg-blue-500 text-white rounded w-fit">
              Ask AI
            </button>
          </DrawerTrigger>

          <DrawerContent className="bg-[#ddd]">
            <DrawerHeader>
              <DrawerTitle>AI Assistant</DrawerTitle>
              <DrawerDescription>
                Here's what I can do for you
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              {/* Your content */}
              Dashboard tools and insights go here.
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <button className="px-4 py-2 bg-red-500 text-white rounded">
                  Close
                </button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default DashboardAI;
