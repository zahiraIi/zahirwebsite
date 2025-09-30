import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

export default function ProjectsSection() {
  const projects = [
    {
      title: "ML-Lab Summer 2025 UCSD",
      description: "Developed decentralized reinforcement learning policies for robotic swarms using local sensing and repulsion-based control. Implemented and benchmarked DDPG, PPO, and SAC in custom Gym environments.",
      technologies: ["Python", "PyTorch", "Reinforcement Learning", "OpenAI Gym", "DDPG", "PPO", "SAC"],
      githubUrl: "https://github.com/zahiraIi/ML-Lab-Summer-2025-UCSD",
    },
    {
      title: "Theology LLM Evaluation",
      description: "Built a multiagent benchmarking system for Islamic ethics knowledge with a team of 12. Launched the first Islamic AI leaderboard with 1000+ prompts and custom evaluations on GPT and Claude.",
      technologies: ["Python", "NLP", "LangChain", "lm-eval-harness", "GPT", "Claude"],
      githubUrl: "https://github.com/zahiraIi",
    },
    {
      title: "TritonGuard",
      description: "Developed a community app for students at risk for deportation, enabling anonymous reporting and communication. Collaborated with UCSA to scale to UC campuses statewide.",
      technologies: ["Swift", "React", "TypeScript", "Firebase"],
      githubUrl: "https://github.com/zahiraIi/TritionGuard",
    },
    {
      title: "ApplyPal - AI Email Generator",
      description: "Engineered an AI-powered emailing tool that helps students tailor their emails using their resume and web scraping for professional opportunities with automatic follow-ups.",
      technologies: ["React", "JavaScript", "Firebase", "OCR", "Web Scraping"],
      githubUrl: "https://github.com/zahiraIi",
    },
    {
      title: "SJSU Concrete Canoes Website",
      description: "Designed and developed a responsive website for SJSU Concrete Canoes Club using Next.js and Tailwind CSS. Integrated Google Sheets API for real-time donation tracking.",
      technologies: ["Next.js", "React", "Tailwind CSS", "Google Sheets API", "OAuth2"],
      githubUrl: "https://github.com/zahiraIi/SJSU-Concrete-Canoes-Website",
      liveUrl: "https://sjsuconcretecanoes.org",
    },
    {
      title: "MCC GenAI Guild Website",
      description: "Official website for the Muslim Tech Collaborative's GenAI Guild, showcasing projects, events, and member contributions.",
      technologies: ["JavaScript", "React", "Web Development"],
      githubUrl: "https://github.com/zahiraIi/mcc-genai-guild-website",
    },
  ];

  return (
    <section id="projects" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-card/30" data-testid="section-projects">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center" data-testid="text-projects-title">
            Projects
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            A selection of my recent work in machine learning, AI research, and full-stack development
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} {...project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
