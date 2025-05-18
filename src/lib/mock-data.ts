
import { Room, RoomTag } from "@/components/RoomCard";
import { addHours, subHours, addDays } from "date-fns";

const now = new Date();

// Helper function to generate random mock rooms
export const generateMockRooms = (count: number): Room[] => {
  const rooms: Room[] = [];
  const tags: RoomTag[] = ["hangout", "work", "brainstorm", "wellness"];
  const titles = [
    "Friday Night Doodles",
    "Bug Bash Session",
    "Weekly Catchup",
    "Book Club Discussion",
    "Coding Sprint",
    "Meditation Circle",
    "Brainstorm New Ideas",
    "Product Demo",
    "Quick Planning",
    "Design Feedback"
  ];
  
  const descriptions = [
    "Join us for a casual drawing session where we can chat and sketch together!",
    "Let's squash those bugs together before the weekend. Bring your debuggers!",
    "Our regular catchup to discuss the week and plan ahead.",
    "Discussing 'Atomic Habits' by James Clear - chapters 4-6.",
    "Sprint to finish the auth module together. Helping hands welcome!",
    "15-minute meditation break to reset and refocus.",
    "Open brainstorming for the upcoming marketing campaign.",
    "Quick demo of the new features. Feedback welcome!",
    "Planning the next sprint tasks and priorities.",
    "Reviewing the latest design mockups. Designers and developers welcome!",
  ];
  
  for (let i = 0; i < count; i++) {
    const isLive = i % 3 === 0;
    const isClosed = i % 3 === 1;
    const isScheduled = i % 3 === 2;
    
    const startTime = isLive 
      ? subHours(now, 1) 
      : isClosed 
        ? subHours(now, 5) 
        : addHours(now, Math.floor(Math.random() * 48) + 1);
    
    const endTime = isLive 
      ? addHours(now, 1) 
      : isClosed 
        ? subHours(now, 2) 
        : addHours(startTime, Math.floor(Math.random() * 3) + 1);
    
    const tag = tags[Math.floor(Math.random() * tags.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const isPrivate = Math.random() > 0.5;
    const maxParticipants = Math.random() > 0.3 ? Math.floor(Math.random() * 10) + 5 : undefined;
    
    const participantCount = Math.floor(Math.random() * 5) + 1;
    const participants = Array.from({ length: participantCount }, (_, j) => `User${i}${j}`);
    
    rooms.push({
      id: `room-${i + 1}`,
      title,
      description,
      isPrivate,
      startTime,
      endTime,
      maxParticipants,
      tag,
      participants,
      createdBy: i % 2 === 0 ? "currentUser" : `User${i}`
    });
  }
  
  return rooms;
};

export const mockRooms = generateMockRooms(10);

export const myRooms = mockRooms.filter((room, index) => index % 2 === 0);

export const trendingRooms = mockRooms
  .filter((room) => !room.isPrivate)
  .sort((a, b) => b.participants.length - a.participants.length)
  .slice(0, 3);

export const upcomingRooms = mockRooms
  .filter((room) => {
    const now = new Date();
    return now < room.startTime && now > subHours(room.startTime, 24);
  })
  .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
  .slice(0, 3);
