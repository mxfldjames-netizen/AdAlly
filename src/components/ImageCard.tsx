import React from 'react';
import { Eye } from 'lucide-react';

interface Image {
  id: number;
  title: string;
  thumbnail: string;
  orientation: string;
}

interface ImageCardProps {
  image: Image;
  index: number;
  onView: (image: Image) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  index,
  onView,
}) => {
  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView(image);
  };

  const isVertical = image.orientation === "vertical";

  return (
    <div className="relative flex-shrink-0 h-36 sm:h-40 lg:h-44 p-2">
      <div
        className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 h-full group ${
          isVertical ? "w-24 sm:w-28 lg:w-32" : "w-48 sm:w-56 lg:w-64"
        } hover:scale-110 hover:shadow-2xl hover:z-10`}
        onClick={handleViewClick}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
        {/* Thumbnail */}
        <img
          src={image.thumbnail}
          alt={image.title}
          className="w-full h-full object-cover"
        />
        {/* View Icon - Always Visible */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 cursor-pointer hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110">
            <Eye className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
        {/* Title */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 z-20">
          <h3 className="text-white font-medium text-xs sm:text-sm transition-all duration-300 group-hover:text-yellow-300">
            {image.title}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;