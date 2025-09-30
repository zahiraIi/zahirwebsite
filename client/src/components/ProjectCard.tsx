import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  index: number;
}

export default function ProjectCard({
  title,
  description,
  technologies,
  githubUrl,
  liveUrl,
  index,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full hover-elevate p-6 transition-all duration-300 hover:translate-y-[-4px]" data-testid={`card-project-${index}`}>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2" data-testid={`text-project-title-${index}`}>{title}</h3>
            <p className="text-muted-foreground leading-relaxed" data-testid={`text-project-description-${index}`}>
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, techIndex) => (
              <Badge key={tech} variant="secondary" className="text-xs" data-testid={`badge-tech-${index}-${techIndex}`}>
                {tech}
              </Badge>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            {githubUrl && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-2"
                data-testid={`button-github-${index}`}
              >
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  Code
                </a>
              </Button>
            )}
            {liveUrl && (
              <Button
                asChild
                size="sm"
                className="gap-2"
                data-testid={`button-live-${index}`}
              >
                <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
