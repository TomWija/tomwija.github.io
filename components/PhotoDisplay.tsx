import React, { useEffect, useState } from "react";
import { TimelineEvent } from "../types";
import { Calendar, Heart } from "lucide-react";

interface PhotoDisplayProps {
  event: TimelineEvent;
}

export const PhotoDisplay: React.FC<PhotoDisplayProps> = ({ event }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation reset on event change
    setAnimate(false);
    const timeout = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timeout);
  }, [event.id]);

  return (
    <div className="flex-1 h-full relative overflow-hidden bg-stone-100 flex items-center justify-center p-4 md:p-12">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-stone-50 opacity-50 z-0">
        <div className="absolute top-10 right-10 w-64 h-64 bg-rose-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div
        className={`relative z-10 w-full max-w-4xl transition-all duration-700 ease-out transform ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[80vh] md:max-h-[600px]">
          {/* Image Section */}
          <div className="w-full md:w-3/5 h-100 md:h-auto relative overflow-hidden group">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-r" />

            {/* Mobile Date Overlay */}
            <div className="absolute bottom-4 left-4 text-white md:hidden">
              <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
                {event.date}
              </p>
              <h2 className="text-2xl font-serif">{event.title}</h2>
            </div>
          </div>

          {/* Text Section */}
          <div className="w-full md:w-2/5 p-6 md:p-10 flex flex-col justify-center bg-white relative">
            <div
              className={`transition-all duration-700 delay-300 ${
                animate
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-4"
              }`}
            >
              <div className="hidden md:flex items-center space-x-2 text-rose-500 mb-4">
                <Calendar size={18} />
                <span className="text-sm font-bold uppercase tracking-widest">
                  {event.date}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-6 leading-tight hidden md:block">
                {event.title}
              </h2>

              <p
                className={`text-stone-600 leading-relaxed ${
                  event.isSpecial
                    ? "text-lg md:text-xl font-medium text-rose-600 italic"
                    : "text-base md:text-lg"
                }`}
              >
                {event.description}
              </p>

              {event.isSpecial && (
                <div className="mt-8 flex items-center justify-center">
                  <Heart className="text-rose-500 fill-rose-500 animate-bounce w-12 h-12" />
                </div>
              )}
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-stone-50 rounded-bl-full -z-10" />
          </div>
        </div>
      </div>
    </div>
  );
};
