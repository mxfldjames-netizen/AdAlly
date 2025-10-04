import React from 'react';
import { ArrowLeft } from 'lucide-react';
import VideoCard from '../components/VideoCard';

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  video: string;
  orientation: string;
}

interface PortfolioPageProps {
  videoData: Video[];
  onVideoPlay: (video: Video) => void;
  onBack: () => void;
}

const PortfolioPage: React.FC<PortfolioPageProps> = ({ videoData, onVideoPlay, onBack }) => {
  return (
    <div className="min-h-screen bg-white pt-16 sm:pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 sm:mb-12">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-300"
          >
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="text-base sm:text-lg">Back to Home</span>
          </button>
        </div>

        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
              Our Portfolio
            </span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto px-4">
            Explore our collection of AI-generated advertisements and short
            films that showcase the future of creative storytelling.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {videoData.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              index={index}
              onPlay={onVideoPlay}
              isGrid={true}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 lg:mt-20 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 text-sm text-gray-500">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-black mb-2">
                {videoData.length}+
              </div>
              <div className="whitespace-nowrap">Creative Projects</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-black mb-2">
                100%
              </div>
              <div className="whitespace-nowrap">AI Generated</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-black mb-2">
                ∞
              </div>
              <div className="whitespace-nowrap">Creative Possibilities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;