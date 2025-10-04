import React from 'react';
import { X } from 'lucide-react';

interface Image {
  id: number;
  title: string;
  thumbnail: string;
  orientation: string;
}

interface ImageModalProps {
  image: Image | null;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, isOpen, onClose }) => {
  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-300 z-10"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Image Container */}
        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
          <div className="aspect-video flex items-center justify-center bg-gray-900">
            <img
              src={image.thumbnail}
              alt={image.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Image Info */}
          <div className="p-4 sm:p-6 bg-white">
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2">
              {image.title}
            </h3>
            <p className="text-gray-600">
              AI-generated static advertisement showcasing creative possibilities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;