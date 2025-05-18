
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
}

interface UserInviteProps {
  invitedUsers: User[];
  onInviteUser: (user: User) => void;
  onRemoveUser: (userId: string) => void;
}

// Mock users for demonstration purposes
const MOCK_USERS: User[] = [
  { id: "1", username: "alex_morgan" },
  { id: "2", username: "taylor_swift" },
  { id: "3", username: "john_doe" },
  { id: "4", username: "jane_smith" },
  { id: "5", username: "dev_ninja" },
];

export function UserInvite({ invitedUsers, onInviteUser, onRemoveUser }: UserInviteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      const filteredUsers = MOCK_USERS.filter(
        (user) => 
          user.username.toLowerCase().includes(query.toLowerCase()) && 
          !invitedUsers.some(invited => invited.id === user.id)
      );
      setSearchResults(filteredUsers);
    } else {
      setSearchResults([]);
    }
  };

  const handleInvite = (user: User) => {
    onInviteUser(user);
    setSearchQuery("");
    setSearchResults([]);
    toast.success(`${user.username} has been invited to the room.`);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          placeholder="Search by username..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
            {searchResults.map((user) => (
              <div 
                key={user.id}
                className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer"
                onClick={() => handleInvite(user)}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{user.username}</span>
                </div>
                <Button size="sm" variant="ghost">Invite</Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {invitedUsers.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Invited Users</h4>
          <div className="space-y-1">
            {invitedUsers.map((user) => (
              <div 
                key={user.id}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{user.username}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => onRemoveUser(user.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
