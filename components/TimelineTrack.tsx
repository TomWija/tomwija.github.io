import React from 'react';
import { TimelineEvent } from '../types';
import { Heart, Circle } from 'lucide-react';

interface TimelineTrackProps {
  events: TimelineEvent[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export const TimelineTrack: React.FC<TimelineTrackProps> = ({ events, currentIndex, onSelect }) => {
  return (
    <div className="flex flex-col h-full w-full max-w-[80px] md:max-w-[200px] border-r border-stone-200 bg-white/80 backdrop-blur-sm z-10 relative">
      <div className="flex-1 overflow-y-auto no-scrollbar py-10 flex flex-col items-center relative">
        {/* Vertical Line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-stone-300 -translate-x-1/2 z-0" />

        {events.map((event, index) => {
          const isActive = index === currentIndex;
          const isPast = index < currentIndex;
          const isFinal = index === events.length - 1;

          return (
            <button
              key={event.id}
              onClick={() => onSelect(index)}
              className={`relative z-10 group flex flex-col items-center justify-center w-full py-6 transition-all duration-500 outline-none
                ${isActive ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-80'}`}
              aria-label={`Go to ${event.date}`}
            >
              {/* Dot / Icon */}
              <div 
                className={`w-4 h-4 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500
                ${isActive ? 'bg-rose-500 border-rose-500 shadow-lg scale-125' : isPast ? 'bg-stone-400 border-stone-400' : 'bg-white border-stone-300'}`}
              >
                 {isFinal ? (
                    <Heart size={12} className={`${isActive ? 'text-white' : 'text-stone-300'} fill-current`} />
                 ) : (
                    isActive && <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />
                 )}
              </div>

              {/* Date Label (Hidden on small mobile for space, visible on tablet+) */}
              <div className={`mt-2 text-[10px] md:text-xs font-medium tracking-widest uppercase transition-colors duration-300 hidden md:block
                ${isActive ? 'text-rose-600' : 'text-stone-500'}`}>
                {event.date.split(' ')[0]} <span className="block text-[8px] md:text-[10px] text-stone-400">{event.date.split(' ')[1]}</span>
              </div>
              
              {/* Mobile abbreviated label */}
              <div className={`mt-1 text-[8px] font-bold md:hidden
                 ${isActive ? 'text-rose-600' : 'text-transparent group-hover:text-stone-400'}`}>
                 {event.date.split(' ')[0].substring(0, 3)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
