import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export default function AvatarDashboard() {
  return (
    (<HoverCard>
      <div className="flex items-center gap-3 mb-1">
        <img
          className="shrink-0 rounded-full"
          src="images/avatar.jpg"
          width={30}
          height={30}
          alt="Avatar" />
        <div className="space-y-0.5">
          <HoverCardTrigger asChild>
            <p className="text-xs  font-medium text-ellipsis">
                Keith Kennedy
            </p>
          </HoverCardTrigger>
          <p className="text-muted-foreground text-xs">@k.kennedy</p>
        </div>
      </div>
      
    </HoverCard>)
  );
}
