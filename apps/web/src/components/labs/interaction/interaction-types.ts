export type PlaybackState = "preparing" | "playing" | "paused" | "complete";

export type ViewportPreset = "wide" | "square" | "portrait";

export type PlaybackController = {
  duration: number;
  progress: number;
  state: PlaybackState;
  ready: boolean;
  play: () => void;
  pause: () => void;
  restart: () => void;
  reverse: () => void;
  seek: (progress: number) => void;
};

export type RuntimeDefinition = {
  name: string;
  model: string;
  payload: string;
  accent: string;
};
