
import { useState, useEffect } from "react";
import { RoomCard, RoomStatus, RoomTag } from "@/components/RoomCard";
import { RoomFilter } from "@/components/RoomFilter";
import { mockRooms } from "@/lib/mock-data";

const Explore = () => {
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus | 'all'>('live');
  const [selectedTag, setSelectedTag] = useState<RoomTag | 'all'>('all');
  const [filteredRooms, setFilteredRooms] = useState([...mockRooms]);

  // Apply filters whenever selections change
  useEffect(() => {
    let filtered = [...mockRooms].filter(room => !room.isPrivate);
    
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
      <div>
        <h1 className="text-3xl font-bold">Explore Rooms</h1>
        <p className="text-muted-foreground mt-1">Discover public rooms to join</p>
      </div>
      
      <RoomFilter
        selectedStatus={selectedStatus}
        selectedTag={selectedTag}
        onStatusChange={setSelectedStatus}
        onTagChange={setSelectedTag}
      />
      
      {filteredRooms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No public rooms available right now</p>
          <p className="text-muted-foreground mt-2">Try changing your filters or check back later</p>
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

export default Explore;
