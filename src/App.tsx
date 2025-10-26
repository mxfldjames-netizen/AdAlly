import React, { useState, useEffect } from "react";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import VideoModal from "./components/VideoModal";
import ImageModal from "./components/ImageModal";
import AuthModal from "./components/auth/AuthModal";
import HomePage from "./pages/HomePage";
import PortfolioPage from "./pages/PortfolioPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";

const videoData = [
  {
    id: 1,
    title: "Lamborghini Huracan",
    thumbnail:
      "https://m.media-amazon.com/images/S/aplus-media/vc/09679e0b-d23f-4afb-a821-7bd728d91562.__CR0,0,970,600_PT0_SX970_V1___.png",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    orientation: "landscape",
  },
  {
    id: 2,
    title: "Tech Animation", 
    thumbnail:
      "https://images-na.ssl-images-amazon.com/images/I/31GjEJUp2EL.jpg",
    video: "https://www.youtube.com/embed/jNQXAC9IVRw",
    orientation: "vertical",
  },
  {
    id: 3,
    title: "Lamborghini Huracan",
    thumbnail:
      <iframe src="https://assets.zyrosite.com/dWxOrW2p4OtD7WKY/shot1-00910-mxB7Wb7OqRtNbpXD.png" width="640" height="480" allow="autoplay"></iframe>,
    video: "https://www.youtube.com/embed/QmhYvijIrZ0",
    orientation: "landscape",
  },
  {
    id: 4,
    title: "Lamborghini",
    thumbnail:
      "https://tse2.mm.bing.net/th/id/OIP.udVRZ3t2BwxQW9GlKTu1fgHaNE?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    video: "https://www.youtube.com/embed/YyNz4--6fro",
    orientation: "vertical",
  },
  {
    id: 5,
    title: "Motion Graphics",
    thumbnail:
      "https://cubicleninjas.com/wp-content/uploads/2019/09/motion-graphics-examples.jpg",
    video: "https://www.youtube.com/embed/L_jWHffIx5E",
    orientation: "landscape",
  },
  {
    id: 6,
    title: "AI Visualization",
    thumbnail:
      "https://img.freepik.com/premium-photo/innovative-intelligence-artificial-intelligence-depicted-through-brain-digital-elements-vertical_904318-11327.jpg",
    video: "https://www.youtube.com/embed/9bZkp7q19f0",
    orientation: "vertical",
  },
  {
    id: 7,
    title: "Digital Art",
    thumbnail: "https://wallpaperaccess.com/full/176937.jpg",
    video: "https://www.youtube.com/embed/ScMzIvxBSi4",
    orientation: "landscape",
  },
  {
    id: 8,
    title: "Future Tech",
    thumbnail:
      "https://tse3.mm.bing.net/th/id/OIP.hzXCVO3ceyYL35RSiDGBvAHaHn?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    video: "https://www.youtube.com/embed/fJ9rUzIMcZQ",
    orientation: "vertical",
  },
  {
    id: 9,
    title: "Dragon Ball",
    thumbnail:
      "https://wallpapercave.com/wp/wp11175180.jpg",
    video: "https://www.youtube.com/embed/fJ9rUzIMcZQ",
    orientation: "vertical",
  },
];

const imageData = [
  {
    id: 1,
    title: "Fashion Brand",
    thumbnail: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
    orientation: "vertical",
  },
  {
    id: 2,
    title: "Tech Product",
    thumbnail: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800",
    orientation: "landscape",
  },
  {
    id: 3,
    title: "Food & Beverage",
    thumbnail: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
    orientation: "vertical",
  },
  {
    id: 4,
    title: "Luxury Watch",
    thumbnail: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800",
    orientation: "landscape",
  },
  {
    id: 5,
    title: "Travel Agency",
    thumbnail: "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800",
    orientation: "vertical",
  },
  {
    id: 6,
    title: "Fitness Brand",
    thumbnail: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800",
    orientation: "landscape",
  },
  {
    id: 7,
    title: "Beauty Product",
    thumbnail: "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800",
    orientation: "vertical",
  },
  {
    id: 8,
    title: "Real Estate",
    thumbnail: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800",
    orientation: "landscape",
  },
];

function AppContent() {
  const [activeItem, setActiveItem] = useState("home");
  const [selectedVideo, setSelectedVideo] = useState<
    (typeof videoData)[0] | null
  >(null);
  const [selectedImage, setSelectedImage] = useState<
    (typeof imageData)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const { user, loading } = useAuth();

  const handleVideoPlay = (video: (typeof videoData)[0]) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleImageView = (image: (typeof imageData)[0]) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const handleBackToHome = () => {
    setActiveItem("home");
  };

  const handleStartCreating = () => {
    if (user) {
      setActiveItem("dashboard");
    } else {
      setAuthMode('signup');
      setIsAuthModalOpen(true);
    }
  };

  const handleLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleSignup = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    // Add global styles for animations
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0) translateX(0) rotate(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(20px) rotate(360deg); opacity: 0; }
      }
      @keyframes shine {
        from { transform: translateX(-100%) rotate(0deg); }
        to { transform: translateX(100%) rotate(5deg); }
      }
      @keyframes gradient-x {
        0% { background-size: 100%; background-position: 0% 0%; }
        50% { background-size: 200%; background-position: 100% 0%; }
        100% { background-size: 100%; background-position: 0% 0%; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation 
        activeItem={activeItem} 
        setActiveItem={setActiveItem}
        user={user}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />

      {/* Page Content */}
      {activeItem === "home" && (
        <HomePage 
          videoData={videoData}
          imageData={imageData}
          onVideoPlay={handleVideoPlay} 
          onImageView={handleImageView}
          onStartCreating={handleStartCreating}
        />
      )}
      {activeItem === "portfolio" && (
        <PortfolioPage
          videoData={videoData}
          onVideoPlay={handleVideoPlay}
          onBack={handleBackToHome}
        />
      )}
      {activeItem === "about" && (
        <AboutPage onBack={handleBackToHome} />
      )}
      {activeItem === "contact" && (
        <ContactPage onBack={handleBackToHome} />
      )}
      {activeItem === "dashboard" && user && (
        <DashboardPage />
      )}

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        isOpen={isImageModalOpen}
        onClose={handleCloseImageModal}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;