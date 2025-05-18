
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import { Room, RoomStatus } from "@/components/RoomCard";
import { mockRooms } from "@/lib/mock-data";
import { ArrowLeft, Clock, Calendar, Users, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  username: string;
  timestamp: Date;
}

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

const getStatusLabel = (status: RoomStatus): string => {
  switch (status) {
    case "scheduled": return "Scheduled";
    case "live": return "Live";
    case "closed": return "Closed";
  }
};

const RoomDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [status, setStatus] = useState<RoomStatus>("scheduled");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [reactions] = useState<Reaction[]>([
    { emoji: "👍", count: 5, users: ["User1", "User2", "User3", "User4", "User5"] },
    { emoji: "🔥", count: 3, users: ["User1", "User2", "User3"] },
    { emoji: "👏", count: 2, users: ["User1", "User2"] },
    { emoji: "❤️", count: 4, users: ["User1", "User2", "User3", "User4"] },
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Find the room by ID
    const foundRoom = mockRooms.find(r => r.id === id);
    if (foundRoom) {
      setRoom(foundRoom);
      
      // Determine room status
      const now = new Date();
      if (isBefore(now, foundRoom.startTime)) {
        setStatus("scheduled");
      } else if (isAfter(now, foundRoom.endTime)) {
        setStatus("closed");
      } else {
        setStatus("live");
        
        // Generate mock messages for live rooms
        const mockMessages: Message[] = [
          { 
            id: "1", 
            text: "Hey everyone! Welcome to the room.", 
            username: foundRoom.createdBy, 
            timestamp: new Date(foundRoom.startTime.getTime() + 60000) 
          },
          { 
            id: "2", 
            text: "Thanks for setting this up!", 
            username: "participant1", 
            timestamp: new Date(foundRoom.startTime.getTime() + 120000) 
          },
          { 
            id: "3", 
            text: "What's the main topic for today?", 
            username: "participant2", 
            timestamp: new Date(foundRoom.startTime.getTime() + 180000) 
          },
          { 
            id: "4", 
            text: "We're discussing the new project roadmap", 
            username: foundRoom.createdBy, 
            timestamp: new Date(foundRoom.startTime.getTime() + 240000) 
          },
        ];
        setMessages(mockMessages);
      }
    }
  }, [id]);
  
  useEffect(() => {
    // Scroll to bottom of messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      username: "currentUser",
      timestamp: new Date()
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };
  
  const handleReact = (emoji: string) => {
    toast.success(`You reacted with ${emoji}`);
  };
  
  if (!room) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading room details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        className="gap-2" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{room.title}</h1>
            <Badge className={`badge-${status}`}>{getStatusLabel(status)}</Badge>
          </div>
          <p className="text-muted-foreground">{room.description}</p>
        </div>
        
        {status === "live" ? (
          <Button onClick={() => toast.success("Joined the room!")}>Join Room</Button>
        ) : status === "scheduled" ? (
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Starts in</p>
            <p className="text-xl font-semibold">{formatDistanceToNow(room.startTime)}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">Room closed</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Date</p>
            <p className="text-muted-foreground">{format(room.startTime, "MMM d, yyyy")}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Time</p>
            <p className="text-muted-foreground">
              {format(room.startTime, "h:mm a")} - {format(room.endTime, "h:mm a")}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Participants</p>
            <p className="text-muted-foreground">
              {room.participants.length}
              {room.maxParticipants ? `/${room.maxParticipants}` : ""}
            </p>
          </div>
        </div>
      </div>
      
      {status === "live" || status === "closed" ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Messages Panel */}
          <div className="col-span-3 border rounded-lg overflow-hidden flex flex-col h-[500px]">
            <div className="py-3 px-4 border-b flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h2 className="font-medium">Room Chat</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.username === "currentUser" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] ${
                      message.username === "currentUser" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                      } rounded-lg px-4 py-2`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium ${
                          message.username === "currentUser" ? "" : "text-primary"
                        }`}>
                          {message.username}
                        </span>
                        <span className="text-xs opacity-70">
                          {format(message.timestamp, "h:mm a")}
                        </span>
                      </div>
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {status === "live" && (
              <div className="p-3 border-t flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Participants & Reactions Panel */}
          <div className="space-y-6">
            <div className="border rounded-lg overflow-hidden">
              <div className="py-3 px-4 border-b">
                <h2 className="font-medium">Participants</h2>
              </div>
              <div className="p-3 space-y-2 max-h-[200px] overflow-y-auto">
                {room.participants.map((participant, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{participant.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{participant}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {status === "live" ? (
              <div className="border rounded-lg overflow-hidden">
                <div className="py-3 px-4 border-b">
                  <h2 className="font-medium">React</h2>
                </div>
                <div className="p-3 flex flex-wrap gap-2">
                  {["👍", "🔥", "👏", "❤️", "🎉", "🙌"].map((emoji) => (
                    <Button 
                      key={emoji} 
                      variant="outline" 
                      className="text-lg"
                      onClick={() => handleReact(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="py-3 px-4 border-b">
                  <h2 className="font-medium">Reactions</h2>
                </div>
                <div className="p-3 space-y-2">
                  {reactions.map((reaction) => (
                    <div key={reaction.emoji} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{reaction.emoji}</span>
                        <span className="text-sm">{reaction.count}</span>
                      </div>
                      <div className="flex -space-x-2">
                        {reaction.users.slice(0, 3).map((user, i) => (
                          <Avatar key={i} className="border-2 border-background h-6 w-6">
                            <AvatarFallback className="text-xs">{user.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {reaction.users.length > 3 && (
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                            +{reaction.users.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <div className="text-roomloop-blue text-5xl mb-4">🕒</div>
          <h3 className="text-xl font-semibold">Room Not Live Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            This room will be active {formatDistanceToNow(room.startTime, { addSuffix: true })}. Make sure to come back then!
          </p>
          <Button variant="outline" onClick={() => toast.success("You'll be reminded when the room goes live!")}>
            Remind Me
          </Button>
        </div>
      )}
    </div>
  );
};

export default RoomDetail;
