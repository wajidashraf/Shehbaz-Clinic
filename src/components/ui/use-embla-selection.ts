"use client";

import type { EmblaCarouselType } from "embla-carousel";
import { useCallback, useEffect, useState } from "react";

export function useEmblaSelection(emblaApi?: EmblaCarouselType) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const updateSelection = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
    setScrollSnaps(api.scrollSnapList());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const frame = window.requestAnimationFrame(() => updateSelection(emblaApi));
    emblaApi.on("select", updateSelection);
    emblaApi.on("reInit", updateSelection);

    return () => {
      window.cancelAnimationFrame(frame);
      emblaApi.off("select", updateSelection);
      emblaApi.off("reInit", updateSelection);
    };
  }, [emblaApi, updateSelection]);

  return { scrollSnaps, selectedIndex };
}
