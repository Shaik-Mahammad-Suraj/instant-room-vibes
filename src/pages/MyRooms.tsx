
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RoomCard, RoomStatus, RoomTag } from "@/components/RoomCard";
import { RoomFilter } from "@/components/RoomFilter";
import { myRooms } from "@/lib/mock-data";
import { Plus } from "lucide-react";

const MyRooms = () => {
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<RoomTag | 'all'>('all');
  const [filteredRooms, setFilteredRooms] = useState([...myRooms]);

  // Apply filters whenever selections change
  useEffect(() => {
    let filtered = [...myRooms];
    
    // Filter by status
    if (selectedStatus !== 'all') {
      const now = new Date();
      filtered = filtered.filter(room => {
        if (selectedStatus === 'scheduled') {
          return now < room.startTime;
        } else if (selectedStatus === 'live') {
          return now >= room.startTime && now <= room.endTime;
        } else if (selectedStatus === 'closed') {
          return now > room.endTime;
        }
        return true;
      });
    }
    
    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(room => room.tag === selectedTag);
    }
    
    setFilteredRooms(filtered);
  }, [selectedStatus, selectedTag]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Rooms</h1>
          <p className="text-muted-foreground mt-1">Rooms you've created or joined</p>
        </div>
        <Link to="/create-room">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Create Room
          </Button>
        </Link>
      </div>
      
      <RoomFilter
        selectedStatus={selectedStatus}
        selectedTag={selectedTag}
        onStatusChange={setSelectedStatus}
        onTagChange={setSelectedTag}
      />
      
      {filteredRooms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">No rooms match your filters</p>
          <Link to="/create-room">
            <Button>Create Your First Room</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRooms;
