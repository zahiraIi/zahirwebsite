import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Github, Linkedin, Twitter, Download } from "lucide-react";

export default function ContactSection() {
  const contactLinks = [
    {
      icon: Mail,
      label: "Email",
      value: "z5ali@ucsd.edu",
      href: "mailto:z5ali@ucsd.edu",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "@zahiraIi",
      href: "https://github.com/zahiraIi",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "/in/zahirali",
      href: "https://linkedin.com/in/zahirali",
    },
    {
      icon: Twitter,
      label: "Twitter/X",
      value: "@zahira1i",
      href: "https://x.com/zahira1i",
    },
  ];

  return (
    <section id="contact" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-card/30" data-testid="section-contact">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-contact-title">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I'm always open to discussing new opportunities, collaborations, or just chatting about ML and technology
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {contactLinks.map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover-elevate transition-all duration-300">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6"
                    data-testid={`link-contact-${link.label.toLowerCase()}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <link.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-muted-foreground mb-1">{link.label}</p>
                        <p className="font-medium">{link.value}</p>
                      </div>
                    </div>
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Button asChild size="lg" className="gap-2" data-testid="button-download-resume">
              <a href="/attached_assets/zahirresume_1759250787038.pdf" target="_blank" rel="noopener noreferrer">
                <Download className="h-5 w-5" />
                Download Resume
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
