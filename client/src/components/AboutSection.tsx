import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users } from "lucide-react";

export default function AboutSection() {
  const skills = [
    "Python", "JavaScript", "C++", "Java", "Swift", "SQL",
    "PyTorch", "TensorFlow", "scikit-learn", "LangChain",
    "React", "Next.js", "Node.js", "Express",
    "Reinforcement Learning", "Neural Networks", "NLP",
    "AWS", "Docker", "Git", "PostgreSQL"
  ];

  return (
    <section id="about" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8" data-testid="section-about">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center" data-testid="text-about-title">
            About Me
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-about-bio">
              Hey, I'm Zahir! I'm a Cognitive Science student at UCSD specializing in Machine Learning and Neural Computation. 
              Currently, I'm working on cutting-edge ML research, developing decentralized reinforcement learning policies for robotic swarms.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              I'm passionate about building intelligent systems that solve real-world problems. From training RL agents 
              to building full-stack applications, I love the intersection of AI and practical software engineering.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              When I'm not coding, you'll find me exploring new ML frameworks, contributing to open-source projects, 
              or discussing the latest advances in AI with fellow enthusiasts.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4 hover-elevate p-4 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-education-title">University of California, San Diego</h3>
                  <p className="text-sm text-muted-foreground">B.S. Cognitive Science: ML & Neural Computation</p>
                  <p className="text-sm text-muted-foreground">Expected June 2027</p>
                </div>
              </div>

              <div className="flex items-start gap-4 hover-elevate p-4 rounded-lg">
                <Users className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-leadership-title">Leadership</h3>
                  <p className="text-sm text-muted-foreground">VP of Education, Muslim Tech Collaborative</p>
                  <p className="text-sm text-muted-foreground">Vice President, Fraternity</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold mb-6" data-testid="text-skills-title">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="hover-elevate text-sm"
                  data-testid={`badge-skill-${index}`}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
