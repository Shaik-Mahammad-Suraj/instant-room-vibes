
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface Friend {
  id: string;
  username: string;
  status: "online" | "offline" | "in-room";
  roomId?: string;
  roomName?: string;
}

// Mock friends data
const mockFriends: Friend[] = [
  { id: "1", username: "alex_morgan", status: "in-room", roomId: "room-1", roomName: "Friday Night Doodles" },
  { id: "2", username: "taylor_swift", status: "online" },
  { id: "3", username: "john_doe", status: "offline" },
  { id: "4", username: "jane_smith", status: "online" },
  { id: "5", username: "dev_ninja", status: "in-room", roomId: "room-3", roomName: "Bug Bash Session" },
];

const Friends = () => {
  const [friends] = useState<Friend[]>(mockFriends);
  const [searchQuery, setSearchQuery] = useState("");
  const [friendRequests] = useState<{ id: string; username: string }[]>([
    { id: "6", username: "code_wizard" },
    { id: "7", username: "design_guru" },
  ]);

  const getStatusBadgeColor = (status: Friend["status"]) => {
    switch (status) {
      case "online": return "bg-roomloop-green";
      case "in-room": return "bg-roomloop-purple";
      default: return "bg-roomloop-gray";
    }
  };

  const filteredFriends = friends.filter(friend => 
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Friends</h1>
        <p className="text-muted-foreground mt-1">Connect and see what your friends are up to</p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search friends..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({friends.length})</TabsTrigger>
          <TabsTrigger value="online">Online ({friends.filter(f => f.status === "online" || f.status === "in-room").length})</TabsTrigger>
          <TabsTrigger value="in-room">In Rooms ({friends.filter(f => f.status === "in-room").length})</TabsTrigger>
          <TabsTrigger value="requests">
            Requests 
            {friendRequests.length > 0 && (
              <Badge className="ml-2 bg-roomloop-purple">{friendRequests.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredFriends.map(friend => (
              <Card key={friend.id} className="transition-all hover:shadow-md">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{friend.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{friend.username}</p>
                        <div className={`h-2 w-2 rounded-full ${getStatusBadgeColor(friend.status)}`}></div>
                      </div>
                      {friend.status === "in-room" && (
                        <p className="text-xs text-muted-foreground">In room: {friend.roomName}</p>
                      )}
                    </div>
                  </div>
                  {friend.status === "in-room" && (
                    <Button size="sm" onClick={() => toast.success(`Joining ${friend.roomName}...`)}>
                      Join
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="online">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredFriends
              .filter(friend => friend.status === "online" || friend.status === "in-room")
              .map(friend => (
                <Card key={friend.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{friend.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{friend.username}</p>
                          <div className={`h-2 w-2 rounded-full ${getStatusBadgeColor(friend.status)}`}></div>
                        </div>
                        {friend.status === "in-room" && (
                          <p className="text-xs text-muted-foreground">In room: {friend.roomName}</p>
                        )}
                      </div>
                    </div>
                    {friend.status === "in-room" && (
                      <Button size="sm" onClick={() => toast.success(`Joining ${friend.roomName}...`)}>
                        Join
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="in-room">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredFriends
              .filter(friend => friend.status === "in-room")
              .map(friend => (
                <Card key={friend.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{friend.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{friend.username}</p>
                          <div className={`h-2 w-2 rounded-full ${getStatusBadgeColor(friend.status)}`}></div>
                        </div>
                        <p className="text-xs text-muted-foreground">In room: {friend.roomName}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => toast.success(`Joining ${friend.roomName}...`)}>
                      Join
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="requests">
          {friendRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No friend requests at the moment</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {friendRequests.map(request => (
                <Card key={request.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{request.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <p className="font-medium">{request.username}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => toast.success(`${request.username} added to your friends list`)}
                      >
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toast.info(`${request.username} request declined`)}
                      >
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Add New Friends</CardTitle>
              <CardDescription>Search by username to send a friend request</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input placeholder="Enter username..." />
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" /> Add Friend
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Friends;
