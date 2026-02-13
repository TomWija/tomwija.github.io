import React, { useState, useEffect, useCallback, useRef } from "react";
import { TimelineTrack } from "./components/TimelineTrack";
import { PhotoDisplay } from "./components/PhotoDisplay";
import { TIMELINE_EVENTS } from "./constants";
import { AnimationState } from "./types";
import { Play, Pause, RefreshCw } from "lucide-react";

// Pre-calculate random rotations for the stack effect so they remain stable
// Alternating left and right rotations with random magnitudes
const ROTATIONS = TIMELINE_EVENTS.map((_, i) => {
  // If it's the last event, make it straight (0 degrees)
  if (i === TIMELINE_EVENTS.length - 1) {
    return 0;
  }

  // Generate a pseudo-random magnitude between 4 and 15 degrees
  const magnitude = ((i * 1337) % 12) + 4;

  // Alternate direction: Even indices rotate left (negative), odd rotate right (positive)
  const sign = i % 2 === 0 ? -1 : 1;

  return sign * magnitude;
});

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationState, setAnimationState] = useState<AnimationState>(
    AnimationState.PLAYING
  );
  const [isMobile, setIsMobile] = useState(false);

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

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      // Tailwind 'md' breakpoint is 768px
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      <main className="flex-1 h-full relative flex items-center justify-center">
        {/* Background decoration (Moved from PhotoDisplay to be global background) */}
        <div className="absolute inset-0 bg-stone-50/50 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-rose-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
        </div>

        {/* Card Stack Container */}
        <div className="relative w-full max-w-5xl h-full flex items-center justify-center px-4 md:px-12 z-10">
          {TIMELINE_EVENTS.map((event, index) => {
            const isFuture = index > currentIndex;
            const isCurrent = index === currentIndex;
            const distance = currentIndex - index;
            // No rotation on mobile
            const rotation = isMobile ? 0 : ROTATIONS[index];

            // Opacity Logic:
            // Future: 1 (but hidden by transform)
            // Current (dist 0): 1
            // Previous (dist 1): 0.4
            // Older (dist >= 2): 0
            let opacity = 1;
            let filter = "none";

            if (isFuture) {
              opacity = 1;
            } else if (distance === 0) {
              opacity = 1;
            } else if (distance === 1) {
              opacity = 0.4;
              filter = "grayscale(30%)";
            } else {
              opacity = 0;
            }

            return (
              <div
                key={event.id}
                className="absolute w-full flex justify-center transition-all duration-700 ease-out"
                style={{
                  zIndex: index, // Ensure stacking order (later cards on top)
                  // Future cards are pushed down off-screen.
                  // Current and past cards are centered.
                  // Rotations give the "pile" look.
                  transform: isFuture
                    ? `translateY(120vh) rotate(${rotation}deg)`
                    : `translateY(0) rotate(${rotation}deg)`,
                  opacity: opacity,
                  filter: filter,
                  pointerEvents: isCurrent ? "auto" : "none",
                }}
              >
                <PhotoDisplay event={event} isActive={isCurrent} />
              </div>
            );
          })}
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex space-x-4 z-50">
          {animationState !== AnimationState.COMPLETED && (
            <button
              onClick={
                animationState === AnimationState.PLAYING
                  ? pauseSlideshow
                  : startSlideshow
              }
              className="bg-white/90 backdrop-blur text-stone-800 p-3 rounded-full shadow-lg hover:scale-110 transition-transform hover:bg-white"
              aria-label={
                animationState === AnimationState.PLAYING ? "Pause" : "Play"
              }
            >
              {animationState === AnimationState.PLAYING ? (
                <Pause size={24} />
              ) : (
                <Play size={24} />
              )}
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
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-200 z-50">
          <div
            className="h-full bg-rose-500 transition-all duration-1000 ease-linear"
            style={{
              width: `${((currentIndex + 1) / TIMELINE_EVENTS.length) * 100}%`,
            }}
          />
        </div>
      </main>
    </div>
  );
}
