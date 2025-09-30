import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface HoverImageProps {
  children: React.ReactNode;
  imageUrl?: string;
  imageSrc?: string;
}

export default function HoverImage({ children, imageUrl, imageSrc }: HoverImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const finalImageSrc = imageSrc || imageUrl;

  if (!finalImageSrc) {
    return <>{children}</>;
  }

  return (
    <>
      <span
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        style={{ position: 'relative', cursor: 'pointer' }}
      >
        {children}
      </span>
      
      {mounted && createPortal(
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                left: mousePos.x + 20,
                top: mousePos.y + 20,
                zIndex: 9999,
                pointerEvents: 'none',
              }}
            >
              <img
                src={finalImageSrc}
                alt="Preview"
                style={{
                  width: '300px',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
