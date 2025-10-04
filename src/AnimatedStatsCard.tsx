import React, { useEffect, useState, useRef } from 'react';
import { Zap, Award, Sparkles } from 'lucide-react';

interface AnimatedStatsCardProps {
  icon: React.ComponentType<{ className?: string }>;
  number: string;
  label: string;
  delay?: number;
}

const AnimatedStatsCard: React.FC<AnimatedStatsCardProps> = ({ 
  icon: Icon, 
  number, 
  label, 
  delay = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const finalValue = parseInt(number) || 100;
  const hasPlus = number.includes('+');
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 1200;
    const startTime = performance.now();
    
    const animateCount = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentValue = Math.floor(progress * finalValue);
      
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(finalValue);
      }
    };
    
    requestAnimationFrame(animateCount);
  }, [isVisible, finalValue]);

  return (
    <div 
      ref={cardRef}
      className={`flex flex-col items-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
          {count}{hasPlus && '+'}
        </span>
      </div>
      <div className="text-xs text-gray-500 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};

export default AnimatedStatsCard;