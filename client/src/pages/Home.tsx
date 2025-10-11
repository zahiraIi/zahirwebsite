import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import DecryptedText from "@/components/DecryptedText";
import LiquidChrome from "@/components/LiquidChrome";
import { Icons } from "@/components/ui/icons";
import { HoverLinkPreview } from "@/components/ui/hover-link-preview";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import TravelingSection from "@/components/TravelingSection";
import MusicSection from "@/components/MusicSection";
import FriendsSection from "@/components/FriendsSection";
import GradualBlur from "@/components/ui/gradual-blur";
import Lenis from '@studio-freight/lenis';

export default function Home() {
  // Define all image arrays first
  const photoGalleryImages = useMemo(() => [
    { 
      id: 1, 
      title: 'Gallery 1', 
      desc: '', 
      url: '/attached_assets/gallery1.webp',
      fullSizeUrl: '/attached_assets/gallery1.webp',
      span: '',
      location: { 
        lat: 37.86789124, 
        lng: -122.25841547, 
        name: "IB's, Durant Avenue, Berkeley, CA",
        url: 'https://earth.google.com/web/search/IB%27s,+Durant+Avenue,+Berkeley,+CA/@37.86789124,-122.25841547,82.18612671a,0d,60y,345.80974038h,83.61296774t,0r/data=CpABGmISXAolMHg4MDg1N2MyZjQwZmExNjg5OjB4ZmNhYjMyYzc4YmRjYTM3MRnU3MDTGu9CQCGzDw3mipBewCohSUIncywgRHVyYW50IEF2ZW51ZSwgQmVya2VsZXksIENBGAEgASImCiQJVmojSWDvQkARgVDUx9fuQkAZSVn3SBuQXsAhNjYDo_qQXsBCAggBIhoKFnpCaEI0VUJGZGdnSTVmbmY4NWZCV1EQAjoDCgEwQgIIAEoNCP___________wEQAA'
      }
    },
    { 
      id: 2, 
      title: 'Gallery 2', 
      desc: '', 
      url: '/attached_assets/gallery2.webp',
      fullSizeUrl: '/attached_assets/gallery2.webp',
      span: '',
      location: { 
        lat: 40.41841624, 
        lng: -3.71186471, 
        name: 'Royal Palace of Madrid, Madrid, Spain',
        url: 'https://earth.google.com/web/search/Royal+Palace+of+Madrid,+Madrid,+Spain/@40.41841624,-3.71186471,650.62109375a,0d,60y,264.27973749h,89.77147772t,0r/data=CpMBGmUSXwokMHhkNDIyODdlN2RhNGE5YzE6MHgyZTdmZWM3OWQ2Y2U0ODUxGY8ZqIx_NURAIXAfuTXptg3AKiVSb3lhbCBQYWxhY2Ugb2YgTWFkcmlkLCBNYWRyaWQsIFNwYWluGAEgASImCiQJVu2WeW3vQkARHdSYo8DuQkAZDsUN-yuQXsAhqchrx-eQXsBCAggBIhoKFk9ETzlRQVh5c0V0dE1EU3NsUUZiQncQAjoDCgEwQgIIAEoNCP___________wEQAA'
      }
    },
    { 
      id: 3, 
      title: 'Gallery 3', 
      desc: '', 
      url: '/attached_assets/gallery3.webp',
      fullSizeUrl: '/attached_assets/gallery3.webp',
      span: '',
      location: { 
        lat: 40.41614085, 
        lng: -3.70796122, 
        name: 'Sol, Madrid, Spain',
        url: 'https://earth.google.com/web/search/Sol,+Madrid,+Spain/@40.41614085,-3.70796122,651.16705322a,0d,60y,37.64059822h,92.47643785t,0r/data=CoABGlISTAokMHhkNDIyODdlMTQ2M2I2Y2Y6MHgxNGEzNDEyMGI5MzMyZDYxGez3xDpVNURAIUfvCjMjog3AKhJTb2wsIE1hZHJpZCwgU3BhaW4YASABIiYKJAnCdW90YTlEQBEsU5v7-jFEQBm6waA7d3UNwCGwzZdhab4NwEICCAEiGgoWQ3E2VVJaRExwMVR3b0tsbEpDX3I2ZxACOgMKATBCAggASg0I____________ARAA'
      }
    },
    { 
      id: 4, 
      title: 'Gallery 4', 
      desc: '', 
      url: '/attached_assets/gallery4.webp',
      fullSizeUrl: '/attached_assets/gallery4.webp',
      span: '',
      location: { 
        lat: 48.85978968, 
        lng: 2.29640822, 
        name: 'Eiffel Tower, Avenue Gustave Eiffel, Paris, France',
        url: 'https://earth.google.com/web/search/Eiffel+Tower,+Avenue+Gustave+Eiffel,+Paris,+France/@48.85978968,2.29640822,33.662766a,0d,59.99988514y,224.00841669h,121.51041095t,0r/data=CiwiJgokCauJ5_dANkRAEZVHPjpHNERAGWdSn3Kikg3AIV7rMSUtwQ3AQgIIASIaChYtdC1tSVNnVHRQWVAxUUNuTDhsbXNnEAI6AwoBMEICCABKDQj___________8BEAA'
      }
    },
    { 
      id: 5, 
      title: 'Gallery 5', 
      desc: '', 
      url: '/attached_assets/gallery5.webp',
      fullSizeUrl: '/attached_assets/gallery5.webp',
      span: '',
      location: { 
        lat: 51.50191138, 
        lng: -0.14048813, 
        name: 'Buckingham Palace, London, UK',
        url: 'https://earth.google.com/web/search/Buckingham+Palace,+London,+UK/@51.50191138,-0.14048813,10.16300521a,0d,60y,228.90805761h,128.85234158t,0r/data=CosBGl0SVwokMHg0ODc2MDUyMGNkNWI1ZWI1OjB4YTI2YWJmNTE0ZDkwMmE3GSSyD7IswElAIX2R0JZzKcK_Kh1CdWNraW5naGFtIFBhbGFjZSwgTG9uZG9uLCBVSxgBIAEiJgokCQM3VOeJbkhAEe5ySkWRbUhAGZwr0hsJawJAIZPH5T0NUwJAQgIIASIbChdDSUhNMG9nS0VJQ0FnSURlOE52cWpBRRAFOgMKATBCAggASg0I____________ARAA'
      }
    },
    { 
      id: 6, 
      title: 'Gallery 6', 
      desc: '', 
      url: '/attached_assets/gallery6.webp',
      fullSizeUrl: '/attached_assets/gallery6.webp',
      span: '',
      location: { 
        lat: 51.50126371, 
        lng: -0.12367764, 
        name: 'Big Ben, London, UK',
        url: 'https://earth.google.com/web/search/Big+Ben,+London,+UK/@51.50126371,-0.12367764,8.03373101a,0d,59.99999995y,235.68497884h,117.86556176t,0r/data=CoIBGlQSTgolMHg0ODc2MDRjMzhjOGNkMWQ5OjB4Yjc4ZjI0NzRiOWE0NWFhORl8E_nkF8BJQCEwPEBBc-e_vyoTQmlnIEJlbiwgTG9uZG9uLCBVSxgBIAEiJgokCc91LrNGwUlAEX0nB3DjwElAGXAdmRDfQLK_IVAni5LceLW_QgIIASIaChZDSUhNMG9nS0VJQ0FnSUM0OHZIaExBEAU6AwoBMEICCABKDQj___________8BEAA'
      }
    },
  ], []);

  const musicLibraryImages = useMemo(() => [
    { 
      id: 1, 
      title: 'Sade - The Best of Sade', 
      desc: '', 
      url: '/attached_assets/sade.webp', 
      span: '',
      link: 'https://open.spotify.com/album/3uSWaQxJAdm5MWKQkQJNoK?si=3O1su-gbRiqH83Wh7dWM-Q'
    },
    { 
      id: 2, 
      title: 'Wizkid - Morayo', 
      desc: '', 
      url: '/attached_assets/wizkid.webp', 
      span: '',
      link: 'https://open.spotify.com/album/3dLXfyaG1kYeSQknLs2LP1?si=HugM8NB4QHSbWSz8CBmWdA'
    },
    { 
      id: 3, 
      title: 'Biggie - Ready to Die (Remaster)', 
      desc: '', 
      url: '/attached_assets/biggie.webp', 
      span: '',
      link: 'https://open.spotify.com/album/2HTbQ0RHwukKVXAlTmCZP2?si=Y5DgHN62QxK5uKV31A20Vw'
    },
    { 
      id: 4, 
      title: 'StarBoy - SoundMan Vol. 1', 
      desc: '', 
      url: '/attached_assets/starboy.webp', 
      span: '',
      link: 'https://open.spotify.com/album/5nhLODdncnkg3rVlzva3YY?si=OGaFTkbeSMm6e8xGdh5-1w'
    },
    { 
      id: 5, 
      title: 'Drake - Views', 
      desc: '', 
      url: '/attached_assets/views.webp', 
      span: '',
      link: 'https://open.spotify.com/album/40GMAhriYJRO1rsY4YdrZb'
    },
    { 
      id: 6, 
      title: 'Anita Baker - Sweet Love', 
      desc: '', 
      url: '/attached_assets/anita.webp', 
      span: '',
      link: 'https://open.spotify.com/album/5ua8gCeWXrvivM9hfVCXhD?si=Bh6_Ghe8TBC4FICeZ1JW8Q'
    },
  ], []);

  const friendsImages = useMemo(() => [
    { 
      id: 1, 
      title: 'Friend 1', 
      desc: '', 
      url: '/attached_assets/friend1.webp',
      fullSizeUrl: '/attached_assets/friend1.webp',
      span: '' 
    },
    { 
      id: 2, 
      title: 'Friend 2', 
      desc: '', 
      url: '/attached_assets/friend2.webp',
      fullSizeUrl: '/attached_assets/friend2.webp',
      span: '' 
    },
    { 
      id: 3, 
      title: 'Friend 3', 
      desc: '', 
      url: '/attached_assets/friend3.webp',
      fullSizeUrl: '/attached_assets/friend3.webp',
      span: '' 
    },
    { 
      id: 4, 
      title: 'Friend 4', 
      desc: '', 
      url: '/attached_assets/friend4.webp',
      fullSizeUrl: '/attached_assets/friend4.webp',
      span: '' 
    },
    { 
      id: 5, 
      title: 'Friend 5', 
      desc: '', 
      url: '/attached_assets/friend5.webp',
      fullSizeUrl: '/attached_assets/friend5.webp',
      span: '' 
    },
    { 
      id: 6, 
      title: 'Friend 6', 
      desc: '', 
      url: '/attached_assets/friend6.webp',
      fullSizeUrl: '/attached_assets/friend6.webp',
      span: '' 
    },
    { 
      id: 7, 
      title: 'Friend 7', 
      desc: '', 
      url: '/attached_assets/friend7.webp',
      fullSizeUrl: '/attached_assets/friend7.webp',
      span: '' 
    },
    { 
      id: 8, 
      title: 'Friend 8', 
      desc: '', 
      url: '/attached_assets/friend8.webp',
      fullSizeUrl: '/attached_assets/friend8.webp',
      span: '' 
    },
    { 
      id: 9, 
      title: 'Friend 9', 
      desc: '', 
      url: '/attached_assets/friend9.webp',
      fullSizeUrl: '/attached_assets/friend9.webp',
      span: '' 
    },
  ], []);

  // Initialize Lenis smooth scrolling - fast and responsive
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.001,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      lerp: 0.15,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      smoothWheel: false,
    });
    
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    
    rafId = requestAnimationFrame(raf);
    
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen text-white">
      {/* Enhanced Gradient Background */}
      <div className="fixed inset-0 w-full h-full">
        {/* Smooth gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #8b5a8f 100%)',
          }}
        />
        
        {/* Liquid Chrome for subtle movement */}
        <div className="absolute inset-0 opacity-70">
          <LiquidChrome 
            baseColor={[0.01, 0.01, 0.01]}
            speed={.3}
            amplitude={2}
            frequencyX={1.5}
            frequencyY={1}
            blurScale={0.6}
            interactive={false}
          />
            </div>
        
        {/* Soft overlay for depth */}
        <div 
          className="absolute inset-0 opacity-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.3) 100%)'
          }}
        />
              </div>
              
      <motion.main 
        className="relative z-[1] min-h-screen px-8 md:px-12 lg:px-16 py-16 md:py-20 flex justify-center overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="max-w-6xl w-full">
          {/* Header Section with Name and Photo */}
          <div className="mb-16 md:mb-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Name and Subtitle */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2, 
                delay: 0.2, 
                ease: [0.16, 1, 0.3, 1] // Smooth ease-out
              }}
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight tracking-tight">
                <DecryptedText 
                  text="Zahir Ali"
                  speed={80}
                  maxIterations={12}
                  sequential={true}
                  revealDirection="start"
                  animateOn="view"
                  className="text-white"
                  encryptedClassName="text-white/40"
                />
            </h1>
              <motion.p 
                className="text-xl md:text-4xl font-light text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                machine learning & software engineer
              </motion.p>
              <motion.p 
                className="text-xl md:text-4xl font-light text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                building software + embedded systems at{' '}
                <HoverLinkPreview
                  href="https://atmosenseinc.com/"
                  previewImage="/attached_assets/atmosense.png"
                  imageAlt="AtmoSense - Revolutionizing gas sensing technology"
                  className="text-xl md:text-4xl font-light"
                >
                  AtmoSense
                </HoverLinkPreview>
              </motion.p>
            </motion.div>

            {/* Profile Photo and Social Links */}
            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 1.0, 
                delay: 0.4, 
                ease: [0.16, 1, 0.3, 1],
                scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
              }}
            >
              <motion.div 
                className="w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl"
                whileHover={{ 
                  scale: 1.05, 
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.25)"
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.img 
                  src="/attached_assets/zahir.webp" 
                  alt="Zahir Ali" 
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>

              {/* Social Icons */}
              <motion.div 
                className="flex gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              >
                {[
                  { href: "mailto:z5ali@ucsd.edu", Icon: Icons.mail, label: "Email" },
                  { href: "https://www.linkedin.com/in/zahir-a1i/", Icon: Icons.linkedin, label: "LinkedIn" },
                  { href: "https://github.com/zahiraIi", Icon: Icons.github, label: "GitHub" }
                ].map(({ href, Icon, label }, index) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? "_blank" : undefined}
                    rel={href.startsWith('http') ? "noopener noreferrer" : undefined}
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label={label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 1.1 + (index * 0.1),
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    whileHover={{ 
                      scale: 1.15, 
                      y: -3,
                      color: "rgba(255, 255, 255, 1)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-7 h-7" />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
            </div>

          {/* About Me Section - Positioned prominently after hero */}
          <div className="-mt-8 md:-mt-4">
            <AboutSection />
          </div>

          {/* Other Sections */}
          <ProjectsSection />
          <TravelingSection images={photoGalleryImages} />
          <MusicSection images={musicLibraryImages} />
          <FriendsSection images={friendsImages} />

          {/* Footer */}
          <motion.div 
            className="mt-16 text-center text-base md:text-lg text-white/60"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            ©2025 Zahir Ali. 
          </motion.div>
        </div>
      </motion.main>

    </div>
  );
}
