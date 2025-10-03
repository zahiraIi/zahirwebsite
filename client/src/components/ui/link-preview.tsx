"use client";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

type LinkPreviewProps = {
  children: React.ReactNode;
  url?: string;
  className?: string;
  width?: number;
  height?: number;
  imageSrc: string;
  imageAlt?: string;
};

export const LinkPreview = ({
  children,
  url,
  className,
  width = 200,
  height = 125,
  imageSrc,
  imageAlt = "preview image",
}: LinkPreviewProps) => {
  const [isOpen, setOpen] = React.useState(false);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);

  const translateX = useSpring(x, springConfig);

  const handleMouseMove = (event: any) => {
    const targetRect = event.target.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2;
    x.set(offsetFromCenter);
  };

  return (
    <HoverCardPrimitive.Root
      openDelay={50}
      closeDelay={100}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <HoverCardPrimitive.Trigger
        onMouseMove={handleMouseMove}
        className={cn("text-black dark:text-white cursor-pointer", className)}
        asChild
      >
        <span>{children}</span>
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Content
        className="[transform-origin:var(--radix-hover-card-content-transform-origin)]"
        side="top"
        align="center"
        sideOffset={10}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                },
              }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              className="shadow-xl rounded-xl"
              style={{
                x: translateX,
              }}
            >
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-1 bg-white dark:bg-black border-2 border-transparent shadow rounded-xl hover:border-neutral-200 dark:hover:border-neutral-800"
                  style={{ fontSize: 0 }}
                >
                  <img
                    src={imageSrc}
                    width={width}
                    height={height}
                    className="rounded-lg object-contain"
                    alt={imageAlt}
                    style={{ width: `${width}px`, height: `${height}px` }}
                  />
                </a>
              ) : (
                <div
                  className="block p-1 bg-white dark:bg-black border-2 border-transparent shadow rounded-xl"
                  style={{ fontSize: 0 }}
                >
                  <img
                    src={imageSrc}
                    width={width}
                    height={height}
                    className="rounded-lg object-contain"
                    alt={imageAlt}
                    style={{ width: `${width}px`, height: `${height}px` }}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Root>
  );
};

