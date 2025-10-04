import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VideoCard from './VideoCard';

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  video: string;
  orientation: string;
}

interface VideoCarouselProps {
  videoData: Video[];
  onVideoPlay: (video: Video) => void;
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videoData, onVideoPlay }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Create enough copies for seamless infinite scroll
  const duplicatedVideoData = [
    ...videoData,
    ...videoData,
    ...videoData,
    ...videoData,
  ];

  // Auto-scroll functionality
  React.useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    const scrollSpeed = 0.5; // pixels per frame - reduced for smoother experience

    const autoScroll = () => {
      if (!isPaused && !isHovered && scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;

        // Calculate when to reset for seamless loop
        const singleSetWidth = scrollContainer.scrollWidth / 4; // Since we have 4 copies
        if (scrollContainer.scrollLeft >= singleSetWidth * 2) {
          scrollContainer.scrollLeft = singleSetWidth; // Reset to second set
        }
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    animationId = requestAnimationFrame(autoScroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPaused, isHovered]);

  const scroll = (direction: "left" | "right") => {
    setIsPaused(true);

    if (scrollRef.current) {
      const scrollAmount = 280; // Adjust based on card width + gap
      const newScrollLeft =
        scrollRef.current.scrollLeft +
        (direction === "right" ? scrollAmount : -scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Scroll Buttons - Hidden on mobile */}
      <button
        onClick={() => scroll("left")}
        className="hidden sm:block absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 lg:p-3 text-black hover:bg-white transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="hidden sm:block absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 lg:p-3 text-black hover:bg-white transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
      </button>

      {/* Video Container */}
      <div
        ref={scrollRef}
        className="flex gap-1 sm:gap-2 overflow-x-auto pb-4 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {duplicatedVideoData.map((video, index) => (
          <VideoCard
            key={`${video.id}-${index}`}
            video={video}
            index={index}
            onPlay={onVideoPlay}
          />
        ))}
      </div>

      {/* Fade edges */}
      <div className="absolute top-0 left-0 w-8 sm:w-16 lg:w-20 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 w-8 sm:w-16 lg:w-20 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

      <style jsx>{`
        .scrollbar-hide {
          -webkit-scrollbar: none;
        }
      `}</style>
    </div>
  );
};

export default VideoCarousel;