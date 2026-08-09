"use client";

import { useEffect } from "react";

export function usePlaybackPoll(
  active: boolean,
  readProgress: () => number,
  onProgress: (progress: number) => void,
) {
  useEffect(() => {
    if (!active) {
      return;
    }

    onProgress(readProgress());
    const interval = window.setInterval(() => {
      onProgress(readProgress());
    }, 100);

    return () => window.clearInterval(interval);
  }, [active, onProgress, readProgress]);
}
