
import { Button } from "@/components/ui/button";
import { RoomStatus, RoomTag } from "./RoomCard";

interface RoomFilterProps {
  selectedStatus: RoomStatus | 'all';
  selectedTag: RoomTag | 'all';
  onStatusChange: (status: RoomStatus | 'all') => void;
  onTagChange: (tag: RoomTag | 'all') => void;
}

export function RoomFilter({ selectedStatus, selectedTag, onStatusChange, onTagChange }: RoomFilterProps) {
  const statuses: Array<{ value: RoomStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'live', label: 'Live Now' },
    { value: 'closed', label: 'Closed' },
  ];

  const tags: Array<{ value: RoomTag | 'all'; label: string }> = [
    { value: 'all', label: 'All Tags' },
    { value: 'hangout', label: 'Hangout' },
    { value: 'work', label: 'Work' },
    { value: 'brainstorm', label: 'Brainstorm' },
    { value: 'wellness', label: 'Wellness' },
  ];

  return (
    <div className="flex flex-col gap-4 mb-6 md:flex-row">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Status</h3>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Button
              key={status.value}
              size="sm"
              variant={selectedStatus === status.value ? "default" : "outline"}
              onClick={() => onStatusChange(status.value)}
            >
              {status.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Button
              key={tag.value}
              size="sm"
              variant={selectedTag === tag.value ? "default" : "outline"}
              onClick={() => onTagChange(tag.value)}
            >
              {tag.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
