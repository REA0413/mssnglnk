import { interpolate } from "flubber";
import { useTransform, MotionValue } from "framer-motion";

export function useFlubber(progress: MotionValue<number>, paths: string[]) {
  return useTransform(progress, [0, 1], paths, {
    mixer: (a, b) => interpolate(a, b, { maxSegmentLength: 0.1 })
  });
} 