import { motion } from "framer-motion";
import { MusicGallery } from "./ui/music-gallery";

interface Image {
  id: number;
  title: string;
  desc: string;
  url: string;
  span: string;
}

interface FriendsSectionProps {
  images: Image[];
}

export default function FriendsSection({ images }: FriendsSectionProps) {
  return (
    <section className="relative flex items-center justify-center py-12 md:py-16 lg:py-20 overflow-hidden">
      <div className="w-full px-4 md:px-6 lg:px-8">
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
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-12 md:mb-16 text-white text-center"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Gallery
          </motion.h2>
          
          <div style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 1200px' }}>
            <MusicGallery 
              images={images} 
              sizeVariant="normal" 
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

