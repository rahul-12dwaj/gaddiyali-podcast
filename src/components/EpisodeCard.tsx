import React from "react";
import { Link } from "react-router-dom";
import { Play, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Episode } from "../types";

interface EpisodeCardProps {
  episode: Episode;
  onWatchLater: () => void;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  onWatchLater,
}) => {
  const createdAtDate =
    episode.createdAt instanceof Date
      ? episode.createdAt
      : episode.createdAt?.toDate
      ? episode.createdAt.toDate()
      : new Date();

  return (
    <div className="bg-white dark:bg-gray-800 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-lg shadow-md overflow-hidden">
      {/* Image with consistent size */}
      <div className="relative group w-full h-full">
        <img
          src={episode.thumbnailUrl || "/path/to/fallback-image.jpg"}
          alt={episode.title}
          className="w-full h-full object-cover transition-transform transform group-hover:scale-105"
          style={{ objectFit: "cover", height: "30%", width: "100%" }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            to={`/watch/${episode.id}`}
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
};
