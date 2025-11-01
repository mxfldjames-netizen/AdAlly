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
          {/* CHANGED: Swapped padding for margin-top */}
          <div className="md:col-span-1 text-left space-y-6 mt-12 sm:mt-16">
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
          {/* CHANGED: Swapped padding for a larger margin-top. Set height to h-72 */}
          <div className="md:col-span-2 relative h-72 mt-12 sm:mt-14">

            {/* === HORIZONTAL ZIG-ZAG LAYOUT === */}

            {/* Feature Circle 1 (Top-Left) */}
            <div
              className="absolute top-0 left-0 w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-black to-gray-800 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:rotate-6 cursor-pointer group rotate-3"
            >
              <div className="text-xl sm:text-2xl font-bold group-hover:scale-110 transition-transform duration-300">1/20th</div>
              <div className="text-[10px] sm:text-xs text-center px-1 group-hover:scale-110 transition-transform duration-300">Cost</div>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>

            {/* Feature Circle 2 (Bottom-Left-Mid) */}
            {/* CHANGED: Replaced bottom-0 with top-44 */}
            <div
              className="absolute top-44 left-[15%] w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-rotate-6 cursor-pointer group -rotate-6"
            >
              <div className="text-xl sm:text-2xl font-bold group-hover:scale-110 transition-transform duration-300">1/10th</div>
              <div className="text-[10px] sm:text-xs text-center px-1 group-hover:scale-110 transition-transform duration-300">Time</div>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>

            {/* Feature Circle 3 (Top-Mid) */}
            <div
              className="absolute top-0 left-[30%] w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-gray-800 to-black rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:rotate-6 cursor-pointer group rotate-2"
            >
              <div className="text-xl sm:text-2xl font-bold group-hover:scale-110 transition-transform duration-300">5X</div>
              <div className="text-[10px] sm:text-xs text-center px-1 group-hover:scale-110 transition-transform duration-300">Engagement</div>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>

            {/* Feature Circle 4 (Bottom-Right-Mid) */}
            {/* CHANGED: Replaced bottom-0 with top-44 */}
            <div
              className="absolute top-44 left-[45%] w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-black to-gray-700 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-rotate-6 cursor-pointer group rotate-6"
            >
              <div className="text-xl sm:text-2xl font-bold text-center px-1 group-hover:scale-110 transition-transform duration-300">Mass</div>
              <div className="text-[10px] sm:text-xs text-center px-1 group-hover:scale-110 transition-transform duration-300">Prod</div>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>

            {/* Feature Circle 5 (Top-Right) */}
            <div
              className="absolute top-0 left-[60%] w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:rotate-6 cursor-pointer group -rotate-3"
            >
              <div className="text-xl sm:text-2xl font-bold text-center px-1 group-hover:scale-110 transition-transform duration-300">Multi</div>
              <div className="text-[10px] sm:text-xs text-center px-1 group-hover:scale-110 transition-transform duration-300">Lang</div>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>

            {/* Feature Circle 6 (Bottom-Right) */}
            {/* CHANGED: Replaced bottom-0 with top-44 */}
            <div
              className="absolute top-44 left-[75%] w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-gray-800 to-black rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-rotate-6 cursor-pointer group rotate-4"
            >
              <div className="text-xl sm:text-2xl font-bold text-center group-hover:scale-110 transition-transform duration-300">∞</div>
              <div className="text-[10px] sm:text-xs text-center px-1 group-hover:scale-110 transition-transform duration-300">Vary</div>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>


            {/* Connecting Lines Effect */}
            {/* SVG lines are unchanged, they will just move down with the container */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
              {/* C1 (Top-L0) to C2 (Bot-L15) */}
              <line x1="10%" y1="20%" x2="25%" y2="80%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
              {/* C2 (Bot-L15) to C3 (Top-L30) */}
              <line x1="25%" y1="80%" x2="40%" y2="20%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
              {/* C3 (Top-L30) to C4 (Bot-L45) */}
              <line x1="40%" y1="20%" x2="55%" y2="80%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
              {/* C4 (Bot-L45) to C5 (Top-L60) */}
              <line x1="55%" y1="80%" x2="70%" y2="20%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
              {/* C5 (Top-L60) to C6 (Bot-L75) */}
              <line x1="70%" y1="20%" x2="85%" y2="80%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
            </svg>
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
        <div className="w-full max-w-5xl mx-auto mb-16">
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