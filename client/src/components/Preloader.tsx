import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  images: string[];
  children: React.ReactNode;
}

export default function Preloader({ images, children }: PreloaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Preload all images
    const imagePromises = images.map((src) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Still resolve on error to not block
        img.src = src;
      });
    });

    // Track progress
    let loadedCount = 0;
    imagePromises.forEach((promise) => {
      promise.then(() => {
        loadedCount++;
        setProgress((loadedCount / images.length) * 100);
      });
    });

    // Wait for all images to load
    Promise.all(imagePromises).then(() => {
      // Small delay to ensure everything is cached
      setTimeout(() => {
        setIsLoaded(true);
      }, 300);
    });
  }, [images]);

  return (
    <>
      <AnimatePresence mode="wait">
        {!isLoaded && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black"
          >
            <div className="flex flex-col items-center gap-6">
              {/* Loading spinner */}
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              
              {/* Progress text */}
              <div className="text-white text-xl font-light">
                {Math.round(progress)}%
              </div>
              
              {/* Progress bar */}
              <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'linear' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render content offscreen until loaded */}
      <div
        style={{
          visibility: isLoaded ? 'visible' : 'hidden',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        {children}
      </div>
    </>
  );
}

