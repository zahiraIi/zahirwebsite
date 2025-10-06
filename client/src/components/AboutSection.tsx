import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="relative py-16 md:py-20 overflow-visible">
      <div className="w-full pb-8">
        <div className="rounded-2xl border border-white/0 bg-white/10 backdrop-blur-l shadow-xl px-6 md:px-8 py-6 md:py-8">
        <motion.h2 
          className="text-5xl md:text-7xl font-bold mb-10 text-white"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          About Me
        </motion.h2>
        
        <div className="space-y-8 text-xl md:text-4xl font-light leading-relaxed">
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-white"
              style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
            >
              
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-white"
              style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
            >
              Sophomore at UC San Diego majoring in Cognitive Science specializing Machine Learning and Neural Computation. Built autonomous systems to 
              natural language processing projects.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-white"
              style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
            >
              You will probably find me traveling, spending time with friends and family, and tinkering with new side projects.
            </motion.p>
        </div>
        </div>
      </div>
    </section>
  );
}

