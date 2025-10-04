import React from 'react';
import { Play } from 'lucide-react';

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  video: string;
  orientation: string;
}

interface VideoCardProps {
  video: Video;
  index: number;
  onPlay: (video: Video) => void;
  isGrid?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  index,
  onPlay,
  isGrid = false,
}) => {
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay(video);
  };

  const isVertical = video.orientation === "vertical";

  if (isGrid) {
    return (
      <div className="relative group">
        <div
          className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 aspect-video bg-gray-100 hover:scale-105 hover:shadow-2xl"
          onClick={handlePlayClick}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
          {/* Thumbnail */}
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          {/* Play Icon - Always Visible */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 sm:p-4 cursor-pointer hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white" />
            </div>
          </div>
          {/* Title */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-20">
            <h3 className="text-white font-medium text-sm sm:text-base transition-all duration-300 group-hover:text-yellow-300">
              {video.title}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  // For Carousel (horizontal scroll)
  return (
    <div className="relative flex-shrink-0 h-36 sm:h-40 lg:h-44 p-2">
      <div
        className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 h-full group ${
          isVertical ? "w-24 sm:w-28 lg:w-32" : "w-48 sm:w-56 lg:w-64"
        } hover:scale-110 hover:shadow-2xl hover:z-10`}
        onClick={handlePlayClick}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
        {/* Thumbnail */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        {/* Play Icon - Always Visible */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 cursor-pointer hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110">
            <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white fill-white" />
          </div>
        </div>
        {/* Title */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 z-20">
          <h3 className="text-white font-medium text-xs sm:text-sm transition-all duration-300 group-hover:text-yellow-300">
            {video.title}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;