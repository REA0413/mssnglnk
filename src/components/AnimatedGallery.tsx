import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedGalleryProps {
  onComplete: () => void;
  showTwoColumns: boolean;
}

export default function AnimatedGallery({ onComplete, showTwoColumns }: AnimatedGalleryProps) {
  const [showSecond, setShowSecond] = useState(false);
  const [showThird, setShowThird] = useState(false);
  const [showFirstLine, setShowFirstLine] = useState(false);
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [showFirstClickMe, setShowFirstClickMe] = useState(true);
  const [showSecondClickMe, setShowSecondClickMe] = useState(true);

  useEffect(() => {
    if (!showTwoColumns) {
      setShowSecond(false);
      setShowThird(false);
      setShowFirstLine(false);
      setShowSecondLine(false);
      setShowFirstClickMe(true);
      setShowSecondClickMe(true);
    }
  }, [showTwoColumns]);

  const handleFirstClick = () => {
    if (!showSecond) {
      setShowFirstClickMe(false);
      setShowFirstLine(true);
      setTimeout(() => {
        setShowSecond(true);
      }, 500);
    }
  };

  const handleSecondClick = () => {
    if (!showThird) {
      setShowSecondClickMe(false);
      setShowSecondLine(true);
      setTimeout(() => {
        setShowThird(true);
        setTimeout(onComplete, 500);
      }, 500);
    }
  };

  return (
    <div className="flex justify-center items-center gap-8 mb-6">
      {/* First GIF and its line */}
      <div className="relative group">
        <motion.div
          initial={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Image
            src="/train_1.gif"
            alt="Train station departure"
            width={100}
            height={75}
            className="rounded-lg cursor-pointer transition-transform hover:scale-105 hover:ring-2 hover:ring-blue-400"
            onClick={handleFirstClick}
          />
          {showFirstClickMe && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 2, 
                repeat: 10, 
                repeatType: "loop" 
              }}
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-blue-500 text-sm whitespace-nowrap"
            >
              Click me!
            </motion.div>
          )}
        </motion.div>
        {showFirstLine && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '32px' }}
            transition={{ duration: 0.5 }}
            className="absolute top-[50px] left-[100px]"
            style={{ zIndex: 1 }}
          >
            <svg width="100%" height="8">
              <motion.path
                d="M0 4 L32 4"
                stroke="#1e40af"
                strokeWidth="3"
                strokeDasharray="6 3"
                transition={{ duration: 0.5 }}
                fill="none"
              />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Second GIF and its line */}
      <AnimatePresence>
        {showSecond && (
          <div className="relative group">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Image
                src="/train_2.gif"
                alt="Train journey"
                width={100}
                height={75}
                className="rounded-lg cursor-pointer transition-transform hover:scale-105 hover:ring-2 hover:ring-blue-400"
                onClick={handleSecondClick}
              />
              {showSecondClickMe && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    duration: 2, 
                    repeat: 10, 
                    repeatType: "loop" 
                  }}
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-blue-500 text-sm whitespace-nowrap"
                >
                  Click me!
                </motion.div>
              )}
            </motion.div>
            {showSecondLine && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '32px' }}
                transition={{ duration: 0.5 }}
                className="absolute top-[50px] left-[100px]"
                style={{ zIndex: 1 }}
              >
                <svg width="100%" height="8">
                  <motion.path
                    d="M0 4 L32 4"
                    stroke="#1e40af"
                    strokeWidth="3"
                    strokeDasharray="6 3"
                    transition={{ duration: 0.5 }}
                    fill="none"
                  />
                </svg>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Third GIF */}
      <AnimatePresence>
        {showThird && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/airport.gif"
              alt="Airport arrival"
              width={100}
              height={75}
              className="rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 