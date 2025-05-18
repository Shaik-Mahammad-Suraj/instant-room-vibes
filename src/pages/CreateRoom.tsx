
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserInvite } from "@/components/UserInvite";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, ArrowLeft, Clock } from "lucide-react";
import { RoomTag } from "@/components/RoomCard";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
}

const CreateRoom = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [maxParticipants, setMaxParticipants] = useState<number | undefined>(undefined);
  const [tag, setTag] = useState<RoomTag>("hangout");
  const [invitedUsers, setInvitedUsers] = useState<User[]>([]);

  const handleInviteUser = (user: User) => {
    setInvitedUsers((prev) => [...prev, user]);
  };

  const handleRemoveUser = (userId: string) => {
    setInvitedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !startDate || !endDate || !tag) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (startDate >= endDate) {
      toast.error("End time must be after start time");
      return;
    }
    
    toast.success("Room created successfully!");
    
    // In a real app, we would save the room data and get an ID back
    setTimeout(() => {
      navigate("/my-rooms");
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button 
        variant="ghost" 
        className="gap-2" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <div>
        <h1 className="text-3xl font-bold">Create a Room</h1>
        <p className="text-muted-foreground mt-1">Set up your micro-meetup space</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Room Title *</Label>
            <Input 
              id="title" 
              placeholder="e.g., Friday Night Doodles" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea 
              id="description" 
              placeholder="What's this room about?" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Start Time *</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal w-full",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Select 
                  onValueChange={(time) => {
                    if (!startDate) return;
                    const [hours, minutes] = time.split(':').map(Number);
                    const newDate = new Date(startDate);
                    newDate.setHours(hours, minutes);
                    setStartDate(newDate);
                  }}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Time">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {startDate ? format(startDate, "HH:mm") : "Time"}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }).map((_, hour) => (
                      [0, 30].map((minute) => (
                        <SelectItem 
                          key={`${hour}:${minute}`} 
                          value={`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}
                        >
                          {`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}
                        </SelectItem>
                      ))
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>End Time *</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal w-full",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => {
                        if (!startDate) return false;
                        return date < startDate;
                      }}
                    />
                  </PopoverContent>
                </Popover>
                
                <Select 
                  onValueChange={(time) => {
                    if (!endDate) return;
                    const [hours, minutes] = time.split(':').map(Number);
                    const newDate = new Date(endDate);
                    newDate.setHours(hours, minutes);
                    setEndDate(newDate);
                  }}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Time">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {endDate ? format(endDate, "HH:mm") : "Time"}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }).map((_, hour) => (
                      [0, 30].map((minute) => (
                        <SelectItem 
                          key={`${hour}:${minute}`} 
                          value={`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}
                        >
                          {`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}
                        </SelectItem>
                      ))
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tag">Room Tag *</Label>
              <Select 
                value={tag} 
                onValueChange={(value: RoomTag) => setTag(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hangout">Hangout</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="brainstorm">Brainstorm</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="maxParticipants">Max Participants (optional)</Label>
              <Input 
                id="maxParticipants" 
                type="number" 
                min={2} 
                placeholder="Unlimited if blank" 
                value={maxParticipants || ""} 
                onChange={(e) => setMaxParticipants(e.target.value ? Number(e.target.value) : undefined)} 
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="private" 
              checked={isPrivate} 
              onCheckedChange={setIsPrivate} 
            />
            <Label htmlFor="private">Private Room (invite only)</Label>
          </div>
          
          {isPrivate && (
            <div>
              <Label>Invite Users</Label>
              <UserInvite 
                invitedUsers={invitedUsers}
                onInviteUser={handleInviteUser}
                onRemoveUser={handleRemoveUser}
              />
            </div>
          )}
        </div>
        
        <Button type="submit" size="lg" className="w-full">
          Create Room
        </Button>
      </form>
    </div>
  );
};

export default CreateRoom;
