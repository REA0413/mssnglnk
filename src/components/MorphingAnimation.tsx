import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useFlubber } from "../hooks/useFlubber";
import { useEffect } from "react";

interface MorphingAnimationProps {
  isVisible: boolean;
  onAnimationComplete: () => void;
}

export default function MorphingAnimation({ isVisible, onAnimationComplete }: MorphingAnimationProps) {
  const progress = useMotionValue(0);
  
  // SVG paths for train and plane
  const paths = [
    // Lightning SVG path
    "M7 2v11h3v9l7-12h-4l4-8z",
    // Plane SVG path
    "M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"
  ];

  const path = useFlubber(progress, paths);

  useEffect(() => {
    if (isVisible) {
      // First set progress to 0 to ensure train is visible
      progress.set(0);
      
      // Add a delay before starting the animation
      const timeout = setTimeout(() => {
        animate(progress, 1, {
          duration: 1,
          ease: "easeInOut",
          onComplete: () => {onAnimationComplete()}
        });
      }, 1000); // Wait 1 second before starting morph animation
      
      // Cleanup timeout if component unmounts
      return () => clearTimeout(timeout);
    } else {
      progress.set(0);
    }
  }, [isVisible, onAnimationComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50"
    >
      <svg width="240" height="240" viewBox="0 0 24 24"> {/* Increased size */}
        <g>
          <motion.path
            d={path}
          fill={useTransform(
            progress,
            [0, 1],
            ["#1abed3", "#023b95"]
            )}
          />
        </g>
      </svg>
    </motion.div>
  );
} 