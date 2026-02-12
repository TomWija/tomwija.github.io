import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TimelineTrack } from './components/TimelineTrack';
import { PhotoDisplay } from './components/PhotoDisplay';
import { TIMELINE_EVENTS } from './constants';
import { AnimationState } from './types';
import { Play, Pause, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationState, setAnimationState] = useState<AnimationState>(AnimationState.PLAYING);
  
  // Ref to hold the interval ID so we can clear it
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll logic
  const startSlideshow = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    setAnimationState(AnimationState.PLAYING);
    
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= TIMELINE_EVENTS.length) {
          // Stop at the end
          if (intervalRef.current) clearInterval(intervalRef.current);
          setAnimationState(AnimationState.COMPLETED);
          return prevIndex;
        }
        return nextIndex;
      });
    }, 4000); // 4 seconds per slide
  }, []);

  const pauseSlideshow = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setAnimationState(AnimationState.PAUSED);
  }, []);

  const resetSlideshow = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentIndex(0);
    setTimeout(startSlideshow, 500); // Small delay before restarting
  }, [startSlideshow]);

  // Handle manual selection
  const handleSelect = (index: number) => {
    pauseSlideshow();
    setCurrentIndex(index);
    // If they manually select the last one, mark as completed
    if (index === TIMELINE_EVENTS.length - 1) {
        setAnimationState(AnimationState.COMPLETED);
    }
  };

  // Start on mount
  useEffect(() => {
    startSlideshow();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startSlideshow]);

  return (
    <div className="flex h-screen w-screen bg-stone-50 overflow-hidden relative">
      
      {/* Left Timeline */}
      <TimelineTrack 
        events={TIMELINE_EVENTS} 
        currentIndex={currentIndex} 
        onSelect={handleSelect} 
      />

      {/* Main Content Area */}
      <main className="flex-1 h-full relative">
        <PhotoDisplay event={TIMELINE_EVENTS[currentIndex]} />
        
        {/* Controls Overlay */}
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex space-x-4 z-50">
           {animationState !== AnimationState.COMPLETED && (
             <button 
               onClick={animationState === AnimationState.PLAYING ? pauseSlideshow : startSlideshow}
               className="bg-white/90 backdrop-blur text-stone-800 p-3 rounded-full shadow-lg hover:scale-110 transition-transform hover:bg-white"
               aria-label={animationState === AnimationState.PLAYING ? "Pause" : "Play"}
             >
               {animationState === AnimationState.PLAYING ? <Pause size={24} /> : <Play size={24} />}
             </button>
           )}
           
           <button 
             onClick={resetSlideshow}
             className="bg-white/90 backdrop-blur text-stone-800 p-3 rounded-full shadow-lg hover:scale-110 transition-transform hover:bg-white"
             aria-label="Restart"
           >
             <RefreshCw size={24} />
           </button>
        </div>

        {/* Progress bar at the very bottom (mobile friendly visual cue) */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-200">
            <div 
                className="h-full bg-rose-500 transition-all duration-1000 ease-linear"
                style={{ width: `${((currentIndex + 1) / TIMELINE_EVENTS.length) * 100}%` }}
            />
        </div>
      </main>

    </div>
  );
}