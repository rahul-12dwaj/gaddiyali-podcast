import React, { useState } from "react";
import ReactPlayer from "react-player";
import {
  Maximize,
  Volume2,
  VolumeX,
  ThumbsUp,
  Share2,
  Clock,
} from "lucide-react";

interface VideoPlayerProps {
  url: string;
  title: string;
  onLike: () => void;
  onAddToWatchLater: () => void;
  isLiked: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  title,
  onLike,
  onAddToWatchLater,
  isLiked,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="aspect-w-16 aspect-h-9">
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          controls
          volume={volume}
          muted={isMuted}
          className="rounded-lg overflow-hidden"
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-xl font-bold dark:text-white">{title}</h1>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400s" />
            )}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <Maximize className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </button>

          <button
            onClick={onLike}
            className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full ${
              isLiked ? "text-indigo-600" : ""
            }`}
          >
            <ThumbsUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </button>

          <button
            onClick={onAddToWatchLater}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </button>

          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <Share2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
