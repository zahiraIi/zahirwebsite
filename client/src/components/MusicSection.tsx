import { motion } from "framer-motion";
import { MusicGallery } from "./ui/music-gallery";

interface Image {
  id: number;
  title: string;
  desc: string;
  url: string;
  span: string;
  link?: string;
}

interface MusicSectionProps {
  images: Image[];
}

export default function MusicSection({ images }: MusicSectionProps) {
  return (
    <section className="relative flex items-center justify-center py-16 md:py-20 overflow-hidden">
      <div className="w-full px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            duration: 0.5, 
            ease: [0.22, 1, 0.36, 1],
            scale: { duration: 0.6 }
          }}
        >
          <motion.h2 
            className="text-5xl md:text-7xl font-bold mb-16 text-white text-center"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Music 
          </motion.h2>
          
          <MusicGallery 
            images={images} 
            sizeVariant="large" 
            enableLinks={true} 
          />
        </motion.div>
      </div>
    </section>
  );
}

