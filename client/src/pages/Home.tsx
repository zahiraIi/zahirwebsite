import Galaxy from "@/components/Galaxy";
import HoverImage from "@/components/HoverImage";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Galaxy 
        mouseInteraction={true}
        density={1.2}
        glowIntensity={0.6}
        saturation={0.7}
        hueShift={220}
      />
      
      <main className="relative z-10 max-w-4xl mx-auto px-8 py-24 min-h-screen">
        <div className="space-y-16">
          {/* Hero */}
          <section data-testid="section-hero" className="space-y-6">
            <h1 className="text-4xl font-normal mb-8" data-testid="text-hero-title">
              Hey, I'm Zahir.
            </h1>
            
            <div className="space-y-4 text-lg leading-relaxed text-white/80">
              <p>
                I'm a Cognitive Science student at{' '}
                <HoverImage imageSrc="https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=300&h=200&fit=crop">
                  <span className="border-b border-white/30 hover:border-white/70 transition-colors">UCSD</span>
                </HoverImage>
                {' '}specializing in Machine Learning and Neural Computation.
              </p>
              
              <p>
                I build intelligent systems with{' '}
                <HoverImage imageSrc="https://images.unsplash.com/photo-1676911809746-79f3ab23f85e?w=300&h=200&fit=crop">
                  <span className="border-b border-white/30 hover:border-white/70 transition-colors">reinforcement learning</span>
                </HoverImage>
                {' '}and neural networks. Currently working on decentralized RL policies for robotic swarms.
              </p>
              
              <p>
                I've helped build systems for{' '}
                <HoverImage imageSrc="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=200&fit=crop">
                  <span className="border-b border-white/30 hover:border-white/70 transition-colors">ML research</span>
                </HoverImage>
                , community safety apps, and AI evaluation tools.
              </p>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Education & Leadership */}
          <section className="space-y-4 text-lg leading-relaxed text-white/80">
            <p>
              I'm pursuing my B.S. in Cognitive Science: ML & Neural Computation at{' '}
              <span className="text-white">University of California, San Diego</span> (expected June 2027).
            </p>
            
            <p>
              I serve as VP of Education at Muslim Tech Collaborative and Vice President of my fraternity.
            </p>
          </section>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Projects */}
          <section className="space-y-6" data-testid="section-projects">
            <h2 className="text-2xl font-normal" data-testid="text-projects-title">Selected Projects</h2>
            
            <div className="space-y-4 text-lg leading-relaxed text-white/80">
              <p>
                <a 
                  href="https://github.com/zahiraIi/ML-Lab-Summer-2025-UCSD" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border-b border-white/30 hover:border-white/70 transition-colors"
                  data-testid="link-ml-lab"
                >
                  ML-Lab Summer 2025
                </a>
                {' '}— Developed decentralized RL policies for robotic swarms using DDPG, PPO, and SAC in custom Gym environments.
              </p>
              
              <p>
                <HoverImage imageSrc="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop">
                  <span className="border-b border-white/30 hover:border-white/70 transition-colors">Theology LLM Evaluation</span>
                </HoverImage>
                {' '}— Built a multiagent benchmarking system for Islamic ethics knowledge. Launched the first Islamic AI leaderboard with 1000+ prompts.
              </p>
              
              <p>
                <a 
                  href="https://github.com/zahiraIi/TritionGuard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border-b border-white/30 hover:border-white/70 transition-colors"
                  data-testid="link-tritonguard"
                >
                  TritonGuard
                </a>
                {' '}— Community safety app for students at risk, enabling anonymous reporting. Scaled to UC campuses statewide with UCSA.
              </p>
              
              <p>
                <HoverImage imageSrc="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop">
                  <span className="border-b border-white/30 hover:border-white/70 transition-colors">ApplyPal</span>
                </HoverImage>
                {' '}— AI-powered email generator that helps students tailor outreach using resume parsing and web scraping with automatic follow-ups.
              </p>
              
              <p>
                <a 
                  href="https://sjsuconcretecanoes.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border-b border-white/30 hover:border-white/70 transition-colors"
                  data-testid="link-asce"
                >
                  SJSU Concrete Canoes
                </a>
                {' '}— Responsive website with Google Sheets API integration for real-time donation tracking and automated membership processing.
              </p>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Experience */}
          <section className="space-y-6" data-testid="section-experience">
            <h2 className="text-2xl font-normal" data-testid="text-experience-title">Experience</h2>
            
            <div className="space-y-6 text-lg leading-relaxed text-white/80">
              <div>
                <p className="text-white mb-2">Machine Learning Engineer</p>
                <p className="text-base">
                  UC San Diego Machine Learning Research · June 2025 - Present
                </p>
              </div>
              
              <div>
                <p className="text-white mb-2">Full Stack Engineer</p>
                <p className="text-base">
                  American Society of Civil Engineers · January 2025 - Present
                </p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Contact */}
          <section className="space-y-4" data-testid="section-contact">
            <div className="flex flex-wrap gap-8 text-lg">
              <a 
                href="mailto:z5ali@ucsd.edu" 
                className="border-b border-white/30 hover:border-white/70 transition-colors"
                data-testid="link-email"
              >
                Email
              </a>
              <a 
                href="https://github.com/zahiraIi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="border-b border-white/30 hover:border-white/70 transition-colors"
                data-testid="link-github"
              >
                GitHub
              </a>
              <a 
                href="https://linkedin.com/in/zahirali" 
                target="_blank" 
                rel="noopener noreferrer"
                className="border-b border-white/30 hover:border-white/70 transition-colors"
                data-testid="link-linkedin"
              >
                LinkedIn
              </a>
              <a 
                href="https://x.com/zahira1i" 
                target="_blank" 
                rel="noopener noreferrer"
                className="border-b border-white/30 hover:border-white/70 transition-colors"
                data-testid="link-twitter"
              >
                Twitter
              </a>
            </div>
            
            <div className="flex gap-8 text-lg pt-4">
              <a 
                href="/attached_assets/zahirresume_1759250787038.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="border-b border-white/30 hover:border-white/70 transition-colors"
                data-testid="link-resume"
              >
                Resume
              </a>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-16 text-sm text-white/40" data-testid="footer">
            z5ali@ucsd.edu
          </footer>
        </div>
      </main>
    </div>
  );
}
