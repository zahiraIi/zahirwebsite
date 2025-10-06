import { motion } from "framer-motion";
import ProjectDialog from "./ProjectDialog";

interface Project {
  title: string;
  description: string;
  previewImage: string;
  logoImage?: string;
  projectUrl?: string;
  externalUrl?: string;
  isEmbeddable?: boolean;
}

const projects: Project[] = [
  {
    title: "UCSD School of Physical Sciences ML Research",
    description: "Robotic-Swarm Reinforcement Learning Navigation using DDPG with LSTM for decentralized control of underwater spinning-bot swarms.",
    previewImage: "/attached_assets/REINFORCEMENTLEARNING.webp",
    logoImage: "/attached_assets/UCSD.webp",
    externalUrl: "https://github.com/zahiraIi/ML-Lab-Summer-2025-UCSD",
    isEmbeddable: false,
  },
  {
    title: "Theology LLM Evaluation",
    description: "Advanced evaluation framework testing LLMs on theological knowledge with comprehensive benchmarking and bias detection.",
    previewImage: "/attached_assets/TheologyLLMEval.webp",
    logoImage: "/attached_assets/MTC.webp",
    projectUrl: "https://mcc-genai-guild.vercel.app",
    externalUrl: "https://mcc-genai-guild.vercel.app",
    isEmbeddable: true,
  },
  {
    title: "SJSU ASCE",
    description: "Responsive website with Google Sheets API integration for real-time donation tracking and automated membership processing.",
    previewImage: "/attached_assets/ASCE_logo.webp",
    logoImage: "/attached_assets/ASCE_logo.webp",
    projectUrl: "https://sjsu-asce-website.vercel.app",
    externalUrl: "https://sjsu-asce-website.vercel.app",
    isEmbeddable: true,
  },
];

export default function ProjectsSection() {
  return (
    <section className="relative py-16 md:py-20 overflow-visible min-h-[80vh]">
      <div className="w-full pb-8">
        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-none shadow-xl px-6 md:px-8 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            duration: 0.5, 
            ease: [0.22, 1, 0.36, 1],
            scale: { duration: 0.6 }
          }}
          className="relative w-full"
        >
          <motion.h2 
            className="text-5xl md:text-7xl font-bold mb-10 text-white"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Projects
          </motion.h2>
          
          <div className="space-y-10">
            {projects.map((project, index) => (
              <ProjectDialog
                key={project.title}
                {...project}
                delay={0.2 + index * 0.1}
              />
            ))}
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}

