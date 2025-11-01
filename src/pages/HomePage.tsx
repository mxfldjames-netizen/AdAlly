import React from 'react';
import { Sparkles, Zap, Award } from 'lucide-react';
import AnimatedStatsCard from '../AnimatedStatsCard';
import VideoCarousel from '../components/VideoCarousel';
import ImageCarousel from '../components/ImageCarousel';
import Footer from '../components/Footer';

// ... (interfaces remain the same) ...

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
            {/* ... (h1, p, and button remain the same) ... */}
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
            {/* Wrapper for controlled circle positioning */}
            <div className="relative h-[240px] w-full max-w-sm">

              {/* Feature Circle 1 - Large (Top Center) */}
              {/* CHANGED: Positioned at top-0 to give max space below */}
              <div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-black to-gray-800 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:rotate-6 cursor-pointer group rotate-2"
              >
                <div className="text-lg sm:text-xl font-bold group-hover:scale-110 transition-transform duration-300">1/20th</div>
                <div className="text-[9px] sm:text-[10px] text-center px-1 group-hover:scale-110 transition-transform duration-300">Cost</div>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>

              {/* Feature Circle 2 - Medium (Mid-Left) */}
              {/* CHANGED: Positioned at top-24 (below C1) and left-4 */}
              <div
                className="absolute top-24 left-4 w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-rotate-6 cursor-pointer group -rotate-6"
              >
                <div className="text-base sm:text-lg font-bold group-hover:scale-110 transition-transform duration-300">1/10th</div>
                <div className="text-[9px] sm:text-[10px] text-center px-1 group-hover:scale-110 transition-transform duration-300">Time</div>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>

              {/* Feature Circle 3 - Medium (Mid-Right) */}
              {/* CHANGED: Positioned at top-16 (for asymmetry) and right-4 */}
              <div
                className="absolute top-16 right-4 w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-800 to-black rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:rotate-6 cursor-pointer group rotate-6"
              >
                <div className="text-base sm:text-lg font-bold group-hover:scale-110 transition-transform duration-300">5X</div>
                <div className="text-[9px] sm:text-[10px] text-center px-1 group-hover:scale-110 transition-transform duration-300">Engagement</div>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>

              {/* Feature Circle 4 - Small (Bottom-Left) */}
              {/* CHANGED: Positioned at bottom-4 (clear of C2) and left-16 */}
              <div
                className="absolute bottom-4 left-16 w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-black to-gray-700 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-rotate-6 cursor-pointer group -rotate-3"
              >
                <div className="text-xs sm:text-sm font-bold text-center px-1 group-hover:scale-110 transition-transform duration-300">Mass</div>
                <div className="text-[8px] sm:text-[9px] text-center px-1 group-hover:scale-110 transition-transform duration-300">Prod</div>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>

              {/* Feature Circle 5 - Small (Bottom-Right) */}
              {/* CHANGED: Positioned at bottom-8 (clear of C3) and right-16 */}
              <div
                className="absolute bottom-8 right-16 w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:rotate-6 cursor-pointer group rotate-3"
              >
                <div className="text-xs sm:text-sm font-bold text-center px-1 group-hover:scale-110 transition-transform duration-300">Multi</div>
                <div className="text-[8px] sm:text-[9px] text-center px-1 group-hover:scale-110 transition-transform duration-300">Lang</div>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>

              {/* Feature Circle 6 - Extra Small (Bottom-Center) */}
              {/* CHANGED: Positioned at bottom-0, centered */}
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-14 sm:w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-rotate-6 cursor-pointer group -rotate-2"
              >
                <div className="text-sm sm:text-base font-bold text-center group-hover:scale-110 transition-transform duration-300">∞</div>
                <div className="text-[8px] sm:text-[9px] text-center group-hover:scale-110 transition-transform duration-300">Vary</div>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>

              {/* Connecting Lines Effect */}
              {/* CHANGED: Updated all coordinates to match new circle positions */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
                {/* C1 (Top-Center) to C2 (Mid-Left) */}
                <line x1="50%" y1="20%" x2="10%" y2="56%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                {/* C1 (Top-Center) to C3 (Mid-Right) */}
                <line x1="50%" y1="20%" x2="90%" y2="43%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                {/* C2 (Mid-Left) to C4 (Bottom-Left) */}
                <line x1="10%" y1="56%" x2="25%" y2="83%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                {/* C3 (Mid-Right) to C5 (Bottom-Right) */}
                <line x1="90%" y1="43%" x2="75%" y2="81%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                {/* C4 (Bottom-Left) to C6 (Bottom-Center) */}
                <line x1="25%" y1="83%" x2="50%" y2="87%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                {/* C5 (Bottom-Right) to C6 (Bottom-Center) */}
                <line x1="75%" y1="81%" x2="50%" y2="87%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
              </svg>
            </div>
          </div>
        </div>

        {/* ... (Rest of the page remains the same) ... */}

        {/* Video Ads Carousel */}
        <div className="w-full max-w-5xl mx-auto mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">Video Ads</h2>
            <p className="text-gray-600 text-sm sm:text-base">AI-generated video advertisements</p>
          </div>
          <VideoCarousel videoData={videoData} onVideoPlay={onVideoPlay} />
        </div>

        {/* Static Ads Carousel */}
        <div className="w-full max-w-5xl mb-16">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">Static Ads</h2>
            <p className="text-gray-600 text-sm sm:text-base">AI-generated static advertisements</p>
          </div>
          <ImageCarousel imageData={imageData} onImageView={onImageView} />
        </div>

        {/* Stats Section - Animated Cards with Counters */}
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 px-4 w-full max-w-4xl mx-auto mb-16 sm:mb-24">
          <AnimatedStatsCard
            icon={Zap}
            number="50+"
            label="ADS CREATED"
            delay={0}
          />
          <AnimatedStatsCard
            icon={Award}
            number="10+"
            label="HAPPY CLIENTS"
            delay={200}
          />
          <AnimatedStatsCard
            icon={Sparkles}
            number="100"
            label="PRODUCTIVITY"
            delay={400}
          />
        </div>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;