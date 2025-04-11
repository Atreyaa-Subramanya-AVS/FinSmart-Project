import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export default function AvatarDashboard({ username = "Atreyaa", email = "avs@gmail.com" }) {
  return (
    <HoverCard>
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
                Kruthik K
            </p>
          </HoverCardTrigger>
          <p className="text-muted-foreground text-xs">@k.kruthik</p>
        </div>
      </div>
    </HoverCard>
  );
}
