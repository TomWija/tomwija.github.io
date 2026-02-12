export interface TimelineEvent {
  id: string;
  date: string; // Display date e.g., "July 2024"
  title: string;
  description: string;
  imageUrl: string;
  isSpecial?: boolean;
}

export enum AnimationState {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}
