import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import DecryptedText from "@/components/DecryptedText";
import LiquidChrome from "@/components/LiquidChrome";
import InteractiveImageBentoGallery from "@/components/ui/bento-gallery";
import { MusicGallery } from "@/components/ui/music-gallery";
import { Icons } from "@/components/ui/icons";
import { LinkPreview } from "@/components/ui/link-preview";
import { LiquidGlassCard } from "@/components/ui/liquid-weather-glass";
import Lenis from '@studio-freight/lenis';

interface DropdownSectionProps {
  title: string;
  children: React.ReactNode;
  noBlur?: boolean;
}

function DropdownSection({ title, children, noBlur = false }: DropdownSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <LiquidGlassCard
      draggable={false}
      expandable={false}
      shadowIntensity="md"
      borderRadius="24px"
      glowIntensity="sm"
      blurIntensity="xl"
      className="mb-6 bg-white/5"
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-8 px-8 flex items-center justify-between text-left text-3xl md:text-4xl font-light"
          whileHover={{ scale: 1.003 }}
          whileTap={{ scale: 0.997 }}
          transition={{ duration: 0.15 }}
        >
          <span className="relative">
            {title}
            <motion.span
              className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-white/60 to-transparent"
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.2 }}
            />
          </span>
          <motion.span
            animate={{ 
              rotate: isOpen ? 45 : 0,
              scale: isOpen ? 1.1 : 1
            }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-light"
          >
            +
          </motion.span>
        </motion.button>
        
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: "auto", 
                opacity: 1,
                transition: {
                  height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.2, delay: 0.05 }
                }
              }}
              exit={{ 
                height: 0, 
                opacity: 0,
                transition: {
                  height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.15 }
                }
              }}
              className="overflow-hidden"
            >
              <motion.div 
                className={`pb-10 px-8 text-lg md:text-xl leading-relaxed ${
                  noBlur ? '' : 'mt-4'
                }`}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -5, opacity: 0 }}
                transition={{ duration: 0.25, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                {children}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </LiquidGlassCard>
  );
}

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      smoothWheel: true,
      smoothTouch: false,
      normalizeWheel: true,
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
                currently building algorithms for sensors...
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

          {/* Dropdown Sections */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <DropdownSection title="about me +">
              <div className="space-y-6 text-white text-xl md:text-2xl leading-relaxed">
                <p>
                  I'm a sophomore at <LinkPreview imageSrc="/attached_assets/UCSD.png" imageAlt="UCSD" className="text-white font-normal underline decoration-white/30 hover:decoration-white/60 underline-offset-4" width={256} height={256}>UCSD</LinkPreview> studying Cognitive Science specializing in Machine Learning and Neural Computation.
                </p>
                <p>
                  You can probably find me hanging out with friends or building a new side-project that I randomly decided to think was cool.
                </p>
                <p>
                  I am currently serving as Vice President of Education at <LinkPreview imageSrc="/attached_assets/MTC.png" imageAlt="Muslim Tech Collaborative" className="text-white font-normal underline decoration-white/30 hover:decoration-white/60 underline-offset-4" width={256} height={256}>Muslim Tech Collaborative</LinkPreview> and Vice President of <LinkPreview imageSrc="/attached_assets/ALM.png" imageAlt="Alpha Lambda Mu" className="text-white font-normal underline decoration-white/30 hover:decoration-white/60 underline-offset-4" width={256} height={256}>Alpha Lambda Mu</LinkPreview>.
                </p>
              </div>
            </DropdownSection>

            <DropdownSection title="projects +">
              <div className="space-y-8 text-white">
                <div>
                  <LinkPreview 
                    imageSrc="/attached_assets/TheologyLLMEval.png" 
                    imageAlt="Theology LLM Evaluation"
                    url="https://mcc-genai-guild.vercel.app"
                    width={256}
                    height={256}
                  >
                    <a 
                      href="https://mcc-genai-guild.vercel.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                      className="text-white font-normal underline decoration-white/30 hover:decoration-white/60 underline-offset-4 text-xl md:text-2xl"
                  >
                    Theology LLM Evaluation
                  </a>
                  </LinkPreview>
                  <p className="mt-3 text-lg md:text-xl leading-relaxed">
                    Comprehensive evaluation framework benchmarking large language models on theological reasoning across five world religions.
                  </p>
                </div>
                
                <div>
                  <LinkPreview 
                    imageSrc="/attached_assets/REINFORCEMENTLEARNING.PNG" 
                    imageAlt="Reinforcement Learning Research"
                    url="https://github.com/zahiraIi/ML-Lab-Summer-2025-UCSD"
                    width={256}
                    height={256}
                  >
                    <a 
                      href="https://github.com/zahiraIi/ML-Lab-Summer-2025-UCSD" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white font-normal text-xl md:text-2xl underline decoration-white/30 hover:decoration-white/60 underline-offset-4"
                    >
                      Reinforcement Learning Research
                    </a>
                  </LinkPreview>
                  <p className="mt-3 text-lg md:text-xl leading-relaxed">
                    Implementation and analysis of Deep Q-Networks for Atari games, exploring model-based vs model-free approaches in complex environments.
              </p>
                </div>
              
                <div>
                  <LinkPreview 
                    imageSrc="/attached_assets/TritonGuard.png" 
                    imageAlt="TritonGuard"
                    url="https://github.com/zahiraIi/TritionGuard"
                    width={256}
                    height={256}
                  >
                  <a 
                    href="https://github.com/zahiraIi/TritionGuard" 
                    target="_blank" 
                    rel="noopener noreferrer"
                      className="text-white font-normal underline decoration-white/30 hover:decoration-white/60 underline-offset-4 text-xl md:text-2xl"
                  >
                    TritonGuard
                  </a>
                  </LinkPreview>
                  <p className="mt-3 text-lg md:text-xl leading-relaxed">
                    Community safety app for students at risk, enabling anonymous reporting. Scaled to UC campuses statewide with UCSA.
                  </p>
                </div>
                
                <div>
                  <LinkPreview 
                    imageSrc="/attached_assets/ApplyPal.png" 
                    imageAlt="ApplyPal"
                    width={256}
                    height={256}
                  >
                    <span className="text-white font-normal text-xl md:text-2xl underline decoration-white/30 hover:decoration-white/60 underline-offset-4">ApplyPal</span>
                  </LinkPreview>
                  <p className="mt-3 text-lg md:text-xl leading-relaxed">
                    AI-powered email generator that helps students tailor outreach using resume parsing and web scraping with automatic follow-ups.
              </p>
                </div>
              
                <div>
                  <LinkPreview 
                    imageSrc="/attached_assets/ASCE_logo.png" 
                    imageAlt="SJSU ASCE"
                    url="https://sjsu-asce-website.vercel.app"
                    width={256}
                    height={256}
                  >
                  <a 
                    href="https://sjsu-asce-website.vercel.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                      className="text-white font-normal underline decoration-white/30 hover:decoration-white/60 underline-offset-4 text-xl md:text-2xl"
                  >
                    SJSU ASCE
                  </a>
                  </LinkPreview>
                  <p className="mt-3 text-lg md:text-xl leading-relaxed">
                    Responsive website with Google Sheets API integration for real-time donation tracking and automated membership processing.
              </p>
            </div>
              </div>
            </DropdownSection>

            <DropdownSection title="photo gallery +" noBlur={true}>
              <MusicGallery images={photoGalleryImages} />
            </DropdownSection>

            <DropdownSection title="music library +" noBlur={true}>
              <MusicGallery images={musicLibraryImages} />
            </DropdownSection>

            <DropdownSection title="movie library +" noBlur={true}>
              <div className="text-white text-xl md:text-2xl">
                <p>Movie library coming soon...</p>
            </div>
            </DropdownSection>
          </motion.div>

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
