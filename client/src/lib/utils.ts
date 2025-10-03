import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cardData = [
  {
    id: 1,
    title: "About Me",
    description: "",
    color: "rgba(79, 209, 197, 0.8)"
  },
  {
    id: 2,
    title: "Projects",
    description: "",
    color: "rgba(147, 51, 234, 0.8)"
  },
  {
    id: 3,
    title: "Traveling",
    description: "",
    color: "rgba(236, 72, 153, 0.8)"
  },
  {
    id: 4,
    title: "Music Library",
    description: "",
    color: "rgba(251, 146, 60, 0.8)"
  },
  {
    id: 5,
    title: "Friends",
    description: "",
    color: "rgba(34, 211, 238, 0.8)"
  }
];
