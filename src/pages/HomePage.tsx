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
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8">
        {/* Main Hero Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 items-start mb-12">
          {/* Left Side - Text Content */}
          <div className="lg:col-span-1 text-left space-y-6">
            {/* Main Heading - Two Lines */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-sm">
              <span className="bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
                AI-Generated
                <br />
                Ads & Short Films
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-sm">
              Unleashing storytelling with AI creativity.
            </p>

            {/* Start Creating Now Button */}
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
          {/* CHANGED: Reduced height from h-[280px] lg:h-[320px] to h-[240px] lg:h-[260px] 
            This tightens the container, allowing it to align better with the text.
          */}
          <div className="lg:col-span-2 relative h-[240px] lg:h-[260px]">
            {/* Feature Circle 1 - Large (Top Center) */}
            {/* CHANGED: Size w-24/h-24 sm:w-28/h-28 -> w-20/h-20 sm:w-24/h-24 */}
            <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-black to-gray-800 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:rotate-6 cursor-pointer group"
            >
              {/* CHANGED: Font size text-xl sm:text-2xl -> text-lg sm:text-xl */}
              <div className="text-lg sm:text-xl font-bold group-hover:scale-110 transition-transform duration-300">1/20th</div>
              {/* CHANGED: Font size text-[10px] sm:text-xs -> text-[9px] sm:text-[10px] */}
              <div className="text-[9px] sm:text-[10px] text-center px-1 group-hover:scale-110 transition-transform duration-300">Cost</div>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>

            {/* Feature Circle 2 - Medium (Top Left) */}
            {/* CHANGED: Size w-20/h-20 sm:w-24/h-24 -> w-18/h-18 sm:w-20/h-20 */}
            {/* CHANGED: Position top-16 left-0 -> top-12 left-4 sm:left-8 */}
            <div
              className="absolute top-12 left-4 sm:left-8 w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-rotate-6 cursor-pointer group"
            >
              {/* CHANGED: Font size text-lg sm:text-xl -> text-base sm:text-lg */}
              <div className="text-base sm:text-lg font-bold group-hover:scale-110 transition-transform duration-300">1/10th</div>
              {/* CHANGED: Font size text-[10px] sm:text-xs -> text-[9px] sm:text-[10px] */}
              <div className="text-[9px] sm:text-[10px] text-center px-1 group-hover:scale-110 transition-transform duration-300">Time</div>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>

            {/* Feature Circle 3 - Medium (Top Right) */}
            {/* CHANGED: Size w-20/h-20 sm:w-24/h-24 -> w-18/h-18 sm:w-20/h-20 */}
            {/* CHANGED: Position top-16 right-0 -> top-12 right-4 sm:right-8 */}
            <div
              className="absolute top-12 right-4 sm:right-8 w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-800 to-black rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:rotate-6 cursor-pointer group"
            >
              {/* CHANGED: Font size text-lg sm:text-xl -> text-base sm:text-lg */}
              <div className="text-base sm:text-lg font-bold group-hover:scale-110 transition-transform duration-300">5X</div>
              {/* CHANGED: Font size text-[10px] sm:text-xs -> text-[9px] sm:text-[10px] */}
              <div className="text-[9px] sm:text-[10px] text-center px-1 group-hover:scale-110 transition-transform duration-300">Engagement</div>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>

            {/* Feature Circle 4 - Small (Bottom Left) */}
            {/* CHANGED: Size w-18/h-18 sm:w-20/h-20 -> w-16/h-16 sm:w-18/h-18 */}
            {/* CHANGED: Position bottom-12 left-8 sm:left-12 -> bottom-8 left-12 sm:left-16 */}
            <div
              className="absolute bottom-8 left-12 sm:left-16 w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-black to-gray-700 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-rotate-6 cursor-pointer group"
            >
              {/* CHANGED: Font size text-sm sm:text-base -> text-xs sm:text-sm */}
              <div className="text-xs sm:text-sm font-bold text-center px-1 group-hover:scale-110 transition-transform duration-300">Mass</div>
              {/* CHANGED: Font size text-[9px] sm:text-[10px] -> text-[8px] sm:text-[9px] */}
              <div className="text-[8px] sm:text-[9px] text-center px-1 group-hover:scale-110 transition-transform duration-300">Prod</div>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>

            {/* Feature Circle 5 - Small (Bottom Right) */}
            {/* CHANGED: Size w-18/h-18 sm:w-20/h-20 -> w-16/h-16 sm:w-18/h-18 */}
            {/* CHANGED: Position bottom-12 right-8 sm:right-12 -> bottom-8 right-12 sm:right-16 */}
            <div
              className="absolute bottom-8 right-12 sm:right-16 w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:rotate-6 cursor-pointer group"
            >
              {/* CHANGED: Font size text-sm sm:text-base -> text-xs sm:text-sm */}
              <div className="text-xs sm:text-sm font-bold text-center px-1 group-hover:scale-110 transition-transform duration-300">Multi</div>
              {/* CHANGED: Font size text-[9px] sm:text-[10px] -> text-[8px] sm:text-[9px] */}
              <div className="text-[8px] sm:text-[9px] text-center px-1 group-hover:scale-110 transition-transform duration-300">Lang</div>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>

            {/* Feature Circle 6 - Extra Small (Bottom Center) */}
            {/* CHANGED: Size w-16/h-16 sm:w-20/h-20 -> w-14/h-14 sm:w-16/h-16 */}
            {/* CHANGED: Position bottom-0 -> bottom-0 (OK) */}
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-14 sm:w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-rotate-6 cursor-pointer group"
            >
              {/* CHANGED: Font size text-base sm:text-lg -> text-sm sm:text-base */}
              <div className="text-sm sm:text-base font-bold text-center group-hover:scale-110 transition-transform duration-300">∞</div>
              {/* CHANGED: Font size text-[9px] sm:text-[10px] -> text-[8px] sm:text-[9px] */}
              <div className="text-[8px] sm:text-[9px] text-center group-hover:scale-110 transition-transform duration-300">Vary</div>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>

            {/* Connecting Lines Effect 
              (No changes needed here - percentages will adapt to the new container height) 
            */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
              <line x1="50%" y1="15%" x2="20%" y2="40%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
              <line x1="50%" y1="15%" x2="80%" y2="40%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
              <line x1="20%" y1="40%" x2="30%" y2="75%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
              <line x1="80%" y1="40%" x2="70%" y2="75%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
              <line x1="30%" y1="75%" x2="50%" y2="95%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
              <line x1="70%" y1="75%" x2="50%" y2="95%" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
            </svg>
          </div>
        </div>

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