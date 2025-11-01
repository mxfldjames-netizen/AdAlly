import React from 'react';
import { Sparkles, Zap, Award } from 'lucide-react';
import AnimatedStatsCard from '../AnimatedStatsCard';
import VideoCarousel from '../components/VideoCarousel';
import ImageCarousel from '../components/ImageCarousel';
import Footer from '../components/Footer';

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  video: string;
  orientation: string;
}

interface Image {
  id: number;
  title: string;
  thumbnail: string;
  orientation: string;
}

interface HomePageProps {
  videoData: Video[];
  imageData: Image[];
  onVideoPlay: (video: Video) => void;
  onImageView: (image: Image) => void;
  onStartCreating: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  videoData,
  imageData,
  onVideoPlay,
  onImageView,
  onStartCreating,
}) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* ... (Background Effects remain the same) ... */}

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8">
        {/* Main Hero Content - Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 items-start mb-12">
          {/* Left Side - Text Content */}
          <div className="md:col-span-1 text-left space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-sm">
              <span className="bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
                AI-Generated
                <br />
                Ads & Short Films
              </span>
            </h1>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-sm">
              Unleashing storytelling with AI creativity.
            </p>

            <button
              onClick={onStartCreating}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-300 bg-gradient-to-r from-black to-gray-800 rounded-full hover:from-gray-800 hover:to-black hover:scale-105 hover:shadow-2xl hover:shadow-black/25"
            >
              <span className="relative z-10">Start Creating Now</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </button>
          </div>

          {/* Right Side - Honeycomb Feature Grid */}
          <div className="md:col-span-2 flex items-start justify-center pt-4 md:pt-0">
            {/* New wrapper for controlled circle positioning */}
            <div className="relative h-[240px] w-full max-w-sm">

              {/* Feature Circle 1 - Large (Top Center-ish) */}
              {/* CHANGED: Positioning and added rotation */}
              <div
                className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-black to-gray-800 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:rotate-6 cursor-pointer group rotate-3"
              >
                <div className="text-lg sm:text-xl font-bold group-hover:scale-110 transition-transform duration-300">1/20th</div>
                <div className="text-[9px] sm:text-[10px] text-center px-1 group-hover:scale-110 transition-transform duration-300">Cost</div>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>

              {/* Feature Circle 2 - Medium (Mid-Left) */}
              {/* CHANGED: Positioning and added rotation */}
              <div
                className="absolute top-16 -left-2 w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-rotate-6 cursor-pointer group -rotate-6"
              >
                <div className="text-base sm:text-lg font-bold group-hover:scale-110 transition-transform duration-300">1/10th</div>
                <div className="text-[9px] sm:text-[10px] text-center px-1 group-hover:scale-110 transition-transform duration-300">Time</div>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>

              {/* Feature Circle 3 - Medium (Mid-Right) */}
              {/* CHANGED: Positioning and added rotation */}
              <div
                className="absolute top-12 right-2 w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-800 to-black rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:rotate-6 cursor-pointer group rotate-6"
              >
                <div className="text-base sm:text-lg font-bold group-hover:scale-110 transition-transform duration-300">5X</div>
                <div className="text-[9px] sm:text-[10px] text-center px-1 group-hover:scale-110 transition-transform duration-300">Engagement</div>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>

              {/* Feature Circle 4 - Small (Bottom-Left) */}
              {/* CHANGED: Positioning and added rotation */}
              <div
                className="absolute bottom-12 left-8 w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-black to-gray-700 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-rotate-6 cursor-pointer group -rotate-3"
              >
                <div className="text-xs sm:text-sm font-bold text-center px-1 group-hover:scale-110 transition-transform duration-300">Mass</div>
                <div className="text-[8px] sm:text-[9px] text-center px-1 group-hover:scale-110 transition-transform duration-300">Prod</div>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>

              {/* Feature Circle 5 - Small (Bottom-Right) */}
              {/* CHANGED: Positioning and added rotation */}
              <div
                className="absolute bottom-4 right-10 w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:rotate-6 cursor-pointer group rotate-2"
              >
                <div className="text-xs sm:text-sm font-bold text-center px-1 group-hover:scale-110 transition-transform duration-300">Multi</div>
                <div className="text-[8px] sm:text-[9px] text-center px-1 group-hover:scale-110 transition-transform duration-300">Lang</div>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>

              {/* Feature Circle 6 - Extra Small (Bottom-Center-Left) */}
              {/* CHANGED: Positioning and added rotation */}
              <div
                className="absolute bottom-0 left-20 transform -translate-x-1/2 w-14 h-14 sm:w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-rotate-6 cursor-pointer group -rotate-4"
              >
                <div className="text-sm sm:text-base font-bold text-center group-hover:scale-110 transition-transform duration-300">∞</div>
                <div className="text-[8px] sm:text-[9px] text-center group-hover:scale-110 transition-transform duration-300">Vary</div>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>

              {/* Connecting Lines Effect 
                These coordinates are now adjusted to connect the new "random" positions.
                I've made educated guesses for the center points of the circles.
              */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
                {/* Circle 1 (top-center) to Circle 2 (mid-left) */}
                <line x1="50%" y1="15%" x2="5%" y2="40%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                {/* Circle 1 (top-center) to Circle 3 (mid-right) */}
                <line x1="50%" y1="15%" x2="95%" y2="35%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                {/* Circle 2 (mid-left) to Circle 4 (bottom-left) */}
                <line x1="5%" y1="40%" x2="25%" y2="75%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                {/* Circle 3 (mid-right) to Circle 5 (bottom-right) */}
                <line x1="95%" y1="35%" x2="78%" y2="80%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                {/* Circle 4 (bottom-left) to Circle 6 (bottom-center-left) */}
                <line x1="25%" y1="75%" x2="45%" y2="90%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                {/* Circle 5 (bottom-right) to Circle 6 (bottom-center-left) */}
                <line x1="78%" y1="80%" x2="45%" y2="90%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
              </svg>
            </div>
          </div>
        </div>

        {/* ... (Video Ads Carousel, Static Ads Carousel, Stats Section remain the same) ... */}

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;