import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function AvatarDashboard({ username, email, profilePicture }) {
  return (
    <HoverCard>
      <div className="flex items-center gap-3 mb-1">
        <div
          className="shrink-0 rounded-full w-[30px] h-[30px] bg-cover bg-center text-sm flex items-center justify-center bg-gray-700 text-white"
          style={{
            backgroundImage: profilePicture ? `url(${profilePicture})` : "none",
          }}
        >
          {!profilePicture && "A"}
        </div>

        <div className="space-y-0.5">
          <HoverCardTrigger asChild>
            <p className="text-xs overflow-hidden max-w-[100px] font-medium text-ellipsis whitespace-nowrap">
              {username}
            </p>
          </HoverCardTrigger>
          <p className="text-muted-foreground text-xs overflow-hidden whitespace-nowrap text-ellipsis max-w-24">
            {email}
          </p>
        </div>
      </div>
    </HoverCard>
  );
}
