import {
  HouseIcon,
  FileUser,
  BotMessageSquare,
  ChartNoAxesCombined,
  NotebookTabs,
  FileUserIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AvatarDashboard from "./Avatar";

export default function VerticalTab({
  tabComponents,
  username,
  email,
  profilePicture,
}) {
  return (
    <Tabs
      defaultValue="tab-1"
      orientation="vertical"
      className="dark min-h-[80svh] flex-row"
    >
      <TabsList className="text-foreground flex-col gap-1 bg-transparent px-1 py-4 justify-start border border-neutral-300 rounded-md rounded-l-none border-l-0 h-[89svh] relative w-fit">
        <TabsTrigger
          value="tab-1"
          className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none group"
        >
          <HouseIcon
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          <h1 className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
            Home
          </h1>
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none group"
        >
          <FileUserIcon
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          <h1 className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
            Details
          </h1>
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none group"
        >
          <NotebookTabs
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          <h1 className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
            Financial Analysis
          </h1>
        </TabsTrigger>
        <TabsTrigger
          value="tab-4"
          className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none group"
        >
          <ChartNoAxesCombined
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          <h1 className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
            Stock Analysis
          </h1>
        </TabsTrigger>
        <TabsTrigger
          value="tab-5"
          className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none group"
        >
          <BotMessageSquare
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          <h1 className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
            Chatbot
          </h1>
        </TabsTrigger>
        <div className="absolute bottom-0">
          <AvatarDashboard username={username} email={email} profilePicture={profilePicture}/>
        </div>
      </TabsList>
      <div className="grow rounded-md border text-start border-none">
        <TabsContent value="tab-1">
          <div>{tabComponents["tab-1"]}</div>
        </TabsContent>
        <TabsContent value="tab-2">
          <div>{tabComponents["tab-2"]}</div>
        </TabsContent>
        <TabsContent value="tab-3">
          <div>{tabComponents["tab-3"]}</div>
        </TabsContent>
        <TabsContent value="tab-4">
          <div>{tabComponents["tab-4"]}</div>
        </TabsContent>
        <TabsContent value="tab-5">
          <div>{tabComponents["tab-5"]}</div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
