
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, isAfter, isBefore } from "date-fns";

export type RoomStatus = "scheduled" | "live" | "closed";
export type RoomTag = "hangout" | "work" | "brainstorm" | "wellness";

export interface Room {
  id: string;
  title: string;
  description: string;
  isPrivate: boolean;
  startTime: Date;
  endTime: Date;
  maxParticipants?: number;
  tag: RoomTag;
  participants: string[];
  createdBy: string;
}

const getRoomStatus = (room: Room): RoomStatus => {
  const now = new Date();
  if (isBefore(now, room.startTime)) return "scheduled";
  if (isAfter(now, room.endTime)) return "closed";
  return "live";
};

const getStatusLabel = (status: RoomStatus): string => {
  switch (status) {
    case "scheduled": return "Scheduled";
    case "live": return "Live";
    case "closed": return "Closed";
  }
};

const getTagLabel = (tag: RoomTag): string => {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
};

export function RoomCard({ room }: { room: Room }) {
  const navigate = useNavigate();
  const status = getRoomStatus(room);
  
  const handleJoinRoom = () => {
    navigate(`/room/${room.id}`);
  };
  
  const handleViewRoom = () => {
    navigate(`/room/${room.id}`);
  };

  return (
    <Card className={`room-card room-${status}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="font-semibold text-lg">{room.title}</CardTitle>
          <Badge className={`badge-${status}`}>{getStatusLabel(status)}</Badge>
        </div>
        <Badge variant="outline" className={`tag-${room.tag}`}>{getTagLabel(room.tag)}</Badge>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{room.description}</p>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div>
            {status === "scheduled" && (
              <p>Starts {formatDistanceToNow(room.startTime, { addSuffix: true })}</p>
            )}
            {status === "live" && (
              <p>Ends {formatDistanceToNow(room.endTime, { addSuffix: true })}</p>
            )}
            {status === "closed" && (
              <p>Ended {formatDistanceToNow(room.endTime, { addSuffix: true })}</p>
            )}
          </div>
          <div>
            {room.maxParticipants && (
              <p>{room.participants.length}/{room.maxParticipants} joined</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <div className="flex -space-x-2">
          {room.participants.slice(0, 3).map((participant, i) => (
            <Avatar key={i} className="border-2 border-background h-6 w-6">
              <AvatarFallback className="text-xs">{participant.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
          {room.participants.length > 3 && (
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
              +{room.participants.length - 3}
            </div>
          )}
        </div>
        {status === "live" ? (
          <Button size="sm" onClick={handleJoinRoom}>Join Now</Button>
        ) : (
          <Button size="sm" variant="outline" onClick={handleViewRoom}>
            {status === "scheduled" ? "Details" : "View Summary"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
