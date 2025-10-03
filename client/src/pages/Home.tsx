import { motion } from "framer-motion";
import { useEffect } from "react";
import DecryptedText from "@/components/DecryptedText";
import LiquidChrome from "@/components/LiquidChrome";
import { Icons } from "@/components/ui/icons";
import { StackedCards } from "@/components/ui/glass-cards";
import Lenis from '@studio-freight/lenis';

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      smoothWheel: true,
    });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    return () => {
      lenis.destroy();
    };
  }, []);

  const photoGalleryImages = [
    { 
      id: 1, 
      title: 'Gallery 1', 
      desc: '', 
      url: '/attached_assets/gallery1.png', 
      span: '' 
    },
    { 
      id: 2, 
      title: 'Gallery 2', 
      desc: '', 
      url: '/attached_assets/gallery2.png', 
      span: '' 
    },
    { 
      id: 3, 
      title: 'Gallery 3', 
      desc: '', 
      url: '/attached_assets/gallery3.png', 
      span: '' 
    },
    { 
      id: 4, 
      title: 'Gallery 4', 
      desc: '', 
      url: '/attached_assets/gallery4.png', 
      span: '' 
    },
    { 
      id: 5, 
      title: 'Gallery 5', 
      desc: '', 
      url: '/attached_assets/gallery5.png', 
      span: '' 
    },
    { 
      id: 6, 
      title: 'Gallery 6', 
      desc: '', 
      url: '/attached_assets/gallery6.jpeg', 
      span: '' 
    },
  ];

  const musicLibraryImages = [
    { 
      id: 1, 
      title: 'Sade', 
      desc: '', 
      url: '/attached_assets/sade.png', 
      span: '' 
    },
    { 
      id: 2, 
      title: 'Wizkid', 
      desc: '', 
      url: '/attached_assets/wizkid.png', 
      span: '' 
    },
    { 
      id: 3, 
      title: 'Biggie', 
      desc: '', 
      url: '/attached_assets/biggie.png', 
      span: '' 
    },
    { 
      id: 4, 
      title: 'Starboy', 
      desc: '', 
      url: '/attached_assets/starboy.png', 
      span: '' 
    },
    { 
      id: 5, 
      title: 'Views', 
      desc: '', 
      url: '/attached_assets/views.png', 
      span: '' 
    },
    { 
      id: 6, 
      title: 'Anita', 
      desc: '', 
      url: '/attached_assets/anita.png', 
      span: '' 
    },
  ];

  const friendsImages = [
    { 
      id: 1, 
      title: 'Friend 1', 
      desc: '', 
      url: '/attached_assets/friend1.png', 
      span: '' 
    },
    { 
      id: 2, 
      title: 'Friend 2', 
      desc: '', 
      url: '/attached_assets/friend2.png', 
      span: '' 
    },
    { 
      id: 3, 
      title: 'Friend 3', 
      desc: '', 
      url: '/attached_assets/friend3.png', 
      span: '' 
    },
    { 
      id: 4, 
      title: 'Friend 4', 
      desc: '', 
      url: '/attached_assets/friend4.png', 
      span: '' 
    },
    { 
      id: 5, 
      title: 'Friend 5', 
      desc: '', 
      url: '/attached_assets/friend5.png', 
      span: '' 
    },
    { 
      id: 6, 
      title: 'Friend 6', 
      desc: '', 
      url: '/attached_assets/friend6.png', 
      span: '' 
    },
    { 
      id: 7, 
      title: 'Friend 7', 
      desc: '', 
      url: '/attached_assets/friend7.png', 
      span: '' 
    },
    { 
      id: 8, 
      title: 'Friend 8', 
      desc: '', 
      url: '/attached_assets/friend8.png', 
      span: '' 
    },
    { 
      id: 9, 
      title: 'Friend 9', 
      desc: '', 
      url: '/attached_assets/friend9.png', 
      span: '' 
    },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Liquid Chrome Background */}
      <div className="fixed inset-0 w-full h-full">
        <LiquidChrome 
          baseColor={[0.05, 0.05, 0.08]}
          speed={0.15}
          amplitude={0.3}
          frequencyX={2.5}
          frequencyY={2}
          interactive={true}
        />
      </div>

      <motion.main 
        className="relative z-[1] min-h-screen px-8 md:px-12 lg:px-16 py-16 md:py-20 flex justify-center overflow-x-hidden will-change-transform"
        style={{ transform: 'translateZ(0)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-3xl w-full">
          {/* Header Section with Name and Photo */}
          <div className="mb-16 md:mb-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Name and Subtitle */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-light mb-4 leading-tight tracking-tight">
                <DecryptedText 
                  text="Zahir Ali"
                  speed={100}
                  maxIterations={15}
                  sequential={true}
                  revealDirection="start"
                  animateOn="view"
                  className="text-white"
                  encryptedClassName="text-white/40"
                />
            </h1>
              <p className="text-xl md:text-2xl font-light text-white mb-2">
                machine learning & software engineer
              </p>
              <p className="text-lg md:text-2xl font-light text-white">
                currently developing algorithms for ozone sensors...
              </p>
            </motion.div>

            {/* Profile Photo and Social Links */}
            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div 
                className="w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-white/20"
                whileHover={{ scale: 1.05, borderColor: "rgba(255, 255, 255, 0.4)" }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <img 
                  src="/attached_assets/zahir.jpg" 
                  alt="Zahir Ali" 
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Social Icons */}
              <motion.div 
                className="flex gap-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {[
                  { href: "mailto:z5ali@ucsd.edu", Icon: Icons.mail, label: "Email" },
                  { href: "https://www.linkedin.com/in/zahir-a1i/", Icon: Icons.linkedin, label: "LinkedIn" },
                  { href: "https://github.com/zahiraIi", Icon: Icons.github, label: "GitHub" }
                ].map(({ href, Icon, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? "_blank" : undefined}
                    rel={href.startsWith('http') ? "noopener noreferrer" : undefined}
                    className="text-white hover:text-white/70 transition-colors"
                    aria-label={label}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Icon className="w-7 h-7" />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Stacked Glass Cards */}
          <StackedCards 
            photoGalleryImages={photoGalleryImages}
            musicLibraryImages={musicLibraryImages}
            friendsImages={friendsImages}
          />

          {/* Footer */}
          <motion.div 
            className="mt-16 text-center text-base md:text-lg text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            ©2025 Zahir Ali. All Rights Reserved.
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
