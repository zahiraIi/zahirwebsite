import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Twitter, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="section-hero">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />
      
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-chart-3/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent" data-testid="text-hero-title">
            Zahir Ali
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-4" data-testid="text-hero-subtitle">
            ML Engineer | AI Researcher | Full Stack Developer
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8" data-testid="text-hero-description">
            Building intelligent systems with reinforcement learning and neural networks at UCSD.
            Passionate about ML research, full-stack development, and creating impactful applications.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <Button asChild size="lg" data-testid="button-contact">
            <a href="#contact">Get in Touch</a>
          </Button>
          <Button asChild variant="outline" size="lg" data-testid="button-projects">
            <a href="#projects">View Projects</a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center justify-center gap-6"
        >
          <a
            href="mailto:z5ali@ucsd.edu"
            className="hover-elevate active-elevate-2 p-2 rounded-full transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-email"
          >
            <Mail className="h-6 w-6" />
          </a>
          <a
            href="https://github.com/zahiraIi"
            className="hover-elevate active-elevate-2 p-2 rounded-full transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-github"
          >
            <Github className="h-6 w-6" />
          </a>
          <a
            href="https://linkedin.com/in/zahirali"
            className="hover-elevate active-elevate-2 p-2 rounded-full transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-linkedin"
          >
            <Linkedin className="h-6 w-6" />
          </a>
          <a
            href="https://x.com/zahira1i"
            className="hover-elevate active-elevate-2 p-2 rounded-full transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-twitter"
          >
            <Twitter className="h-6 w-6" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <button
            onClick={() => scrollToSection("#about")}
            className="animate-bounce hover-elevate p-2 rounded-full"
            data-testid="button-scroll-down"
          >
            <ChevronDown className="h-8 w-8" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
