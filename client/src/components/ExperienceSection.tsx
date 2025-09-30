import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar } from "lucide-react";

export default function ExperienceSection() {
  const experiences = [
    {
      title: "Machine Learning Engineer",
      company: "UC San Diego Machine Learning Research",
      location: "San Diego, CA",
      period: "June 2025 - Present",
      achievements: [
        "Developed decentralized reinforcement learning (RL) policies for robotic swarms using local sensing and repulsion-based control (fan + magnet actuation)",
        "Implemented and benchmarked DDPG, PPO, and SAC in custom Gym environments to evaluate swarm goal-reaching performance under varying agent counts and observation radii",
        "Designed shared neural network policies for decentralized agents with continuous action spaces, replacing DQN-style discrete models",
        "Built modular simulation, visualization, and analysis pipelines for rapid experimentation and debugging",
      ],
      technologies: ["Python", "PyTorch", "Reinforcement Learning", "DDPG", "PPO", "SAC", "OpenAI Gym"],
    },
    {
      title: "Full Stack Engineer",
      company: "American Society of Civil Engineers",
      location: "San Jose, CA",
      period: "January 2025 - Present",
      achievements: [
        "Designed and developed a responsive website for SJSU Concrete Canoes Club and ASCE team using Next.js, React, and Tailwind CSS, improving club engagement by 40%",
        "Engineered seamless integration with Google Sheets API using OAuth2 authentication and REST API calls, enabling real-time tracking of donations and automated membership application processing",
        "Developed multiple automation scripts in JavaScript/Node.js that synchronize website content with Google Sheets data, reducing manual update time from hours to minutes",
      ],
      technologies: ["Next.js", "React", "Tailwind CSS", "Google Sheets API", "OAuth2", "Node.js"],
    },
  ];

  return (
    <section id="experience" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8" data-testid="section-experience">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center" data-testid="text-experience-title">
            Work Experience
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            My professional journey in machine learning research and full-stack development
          </p>
        </motion.div>

        <div className="space-y-8 max-w-5xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title + exp.company}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="p-6 hover-elevate transition-all duration-300" data-testid={`card-experience-${index}`}>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold" data-testid={`text-exp-title-${index}`}>{exp.title}</h3>
                      <p className="text-lg text-primary" data-testid={`text-exp-company-${index}`}>{exp.company}</p>
                      <p className="text-sm text-muted-foreground">{exp.location}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span data-testid={`text-exp-period-${index}`}>{exp.period}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {exp.achievements.map((achievement, achIndex) => (
                      <div key={achIndex} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-chart-3 mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground leading-relaxed" data-testid={`text-exp-achievement-${index}-${achIndex}`}>
                          {achievement}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <Badge 
                        key={tech} 
                        variant="secondary" 
                        className="text-xs"
                        data-testid={`badge-exp-tech-${index}-${techIndex}`}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
