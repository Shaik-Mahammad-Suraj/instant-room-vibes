
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RoomCard, Room, RoomStatus, RoomTag } from "@/components/RoomCard";
import { mockRooms, trendingRooms, upcomingRooms } from "@/lib/mock-data";
import { Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [liveRooms, setLiveRooms] = useState<Room[]>([]);

  // Find live rooms on component mount and every minute after
  useEffect(() => {
    const findLiveRooms = () => {
      const now = new Date();
      const live = mockRooms.filter(
        room => now >= room.startTime && now <= room.endTime
      ).slice(0, 3);
      setLiveRooms(live);
    };
    
    findLiveRooms();
    const interval = setInterval(findLiveRooms, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, User!</h1>
          <p className="text-muted-foreground mt-1">Stay connected with your micro-communities.</p>
        </div>
        <Link to="/create-room">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Create Room
          </Button>
        </Link>
      </div>

      {liveRooms.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Live Now</h2>
            <Link to="/explore" className="text-primary flex items-center gap-1 text-sm">
              See all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming</CardTitle>
            <CardDescription>Starting in the next 24h</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingRooms.length > 0 ? (
                upcomingRooms.map(room => (
                  <RoomCard key={room.id} room={room} />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No upcoming rooms</p>
              )}
            </div>
            <Link to="/my-rooms">
              <Button variant="ghost" className="w-full mt-4">View All My Rooms</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Trending</CardTitle>
            <CardDescription>Popular public rooms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendingRooms.map(room => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
            <Link to="/explore">
              <Button variant="ghost" className="w-full mt-4">Explore More</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Your activity overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                <span>Rooms Created</span>
                <span className="font-semibold">7</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                <span>Rooms Joined</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                <span>Active Friends</span>
                <span className="font-semibold">5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
