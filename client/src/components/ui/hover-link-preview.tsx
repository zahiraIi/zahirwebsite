"use client" 

import * as React from "react"
import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
 
interface HoverLinkPreviewProps {
  href: string;
  previewImage: string;
  imageAlt?: string;
  children: React.ReactNode;
}
 
const HoverLinkPreview: React.FC<HoverLinkPreviewProps> = ({
  href,
  previewImage,
  imageAlt = "Link preview",
  children,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const prevX = useRef<number | null>(null);
 
  // Motion values for smooth animation
  const motionTop = useMotionValue(0);
  const motionLeft = useMotionValue(0);
  const motionRotate = useMotionValue(0);
 
  // Springs for natural movement
  const springTop = useSpring(motionTop, { stiffness: 300, damping: 30 });
  const springLeft = useSpring(motionLeft, { stiffness: 300, damping: 30 });
  const springRotate = useSpring(motionRotate, { stiffness: 300, damping: 20 });
 
  // Handlers
  const handleMouseEnter = () => {
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      const PREVIEW_WIDTH = 250;
      const PREVIEW_HEIGHT = 140;
      const OFFSET_Y = -40;
      
      // Position preview above the element, centered on it
      const elementCenterX = rect.left + rect.width / 2;
      motionTop.set(rect.top - PREVIEW_HEIGHT - OFFSET_Y);
      motionLeft.set(elementCenterX - PREVIEW_WIDTH / 2);
    }
    setShowPreview(true);
    prevX.current = null;
  };
 
  const handleMouseLeave = () => {
    setShowPreview(false);
    prevX.current = null;
    motionRotate.set(0);
  };
 
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Calculate tilt based on horizontal movement for subtle animation
    if (prevX.current !== null) {
      const deltaX = e.clientX - prevX.current;
      const newRotate = Math.max(-8, Math.min(8, deltaX * 0.8));
      motionRotate.set(newRotate);
    }
    prevX.current = e.clientX;
  };
 
  return (
    <>
      <a
        ref={linkRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative inline-block cursor-pointer text-white underline decoration-white/30 hover:decoration-white/60 underline-offset-4 text-2xl md:text-3xl font-normal"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {children}
      </a>
 
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10, rotate: 0 }}
            style={{
              position: "fixed",
              top: springTop,
              left: springLeft,
              rotate: springRotate,
              zIndex: 9999,
              pointerEvents: "none",
            }}
          >
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-3">
              <img
                src={previewImage}
                alt={imageAlt}
                draggable={false}
                className="w-auto h-auto max-w-[220px] max-h-[110px] object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
 
export { HoverLinkPreview };
