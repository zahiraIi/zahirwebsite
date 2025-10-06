import { motion } from "framer-motion";

interface ProjectDialogProps {
  title: string;
  description: string;
  previewImage: string;
  logoImage?: string;
  projectUrl?: string;
  externalUrl?: string;
  isEmbeddable?: boolean;
  delay?: number;
}

export default function ProjectDialog({
  title,
  description,
  previewImage,
  logoImage,
  projectUrl,
  externalUrl,
  isEmbeddable = true,
  delay = 0.2,
}: ProjectDialogProps) {
  // For non-embeddable projects, show preview image with external link
  if (!isEmbeddable || !projectUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
        className="group"
      >
        {/* Title with Logo */}
        <div className="mb-4 flex items-center gap-4">
          {logoImage && (
            <div className="flex-shrink-0">
              <img 
                src={logoImage} 
                alt={`${title} logo`}
                className={
                  title === "San Jose State University American Society of Civil Engineers" 
                    ? "h-12 md:h-16 w-auto max-w-[160px] md:max-w-[200px] p-2 rounded-l border-2 border-white/20 shadow-lg bg-black/20 project-logo object-contain"
                    : title.includes("UCSD")
                    ? "w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white/20 shadow-lg project-logo"
                    : "w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border-2 border-white/20 shadow-lg project-logo"
                }
              />
            </div>
          )}
          <div className="flex-1">
            {externalUrl ? (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-normal text-2xl md:text-3xl hover:text-white/80 transition-colors"
                style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)' }}
              >
                {title}
              </a>
            ) : (
              <span className="text-white font-normal text-2xl md:text-3xl" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)' }}>
                {title}
              </span>
            )}
          </div>
        </div>
        
        <p 
          className="text-xl leading-relaxed text-white transition-colors duration-200" 
          style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
        >
          {description}
        </p>
        
        {/* Preview Image */}
        <motion.div
          className="mt-6 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl project-preview-image"
          whileHover={{ scale: 1.01, borderColor: "rgba(255, 255, 255, 0.4)" }}
          transition={{ duration: 0.3 }}
        >
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative group/image"
          >
            <img 
              src={previewImage} 
              alt={title}
              className="w-full h-auto object-cover max-h-[600px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-xl font-semibold px-6 py-3 bg-black/60 backdrop-blur-md rounded-full border border-white/50 flex items-center gap-2 shadow-2xl">
                View Project
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </span>
            </div>
          </a>
        </motion.div>
      </motion.div>
    );
  }

  // For embeddable projects, show live iframe directly
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      {/* Title with Logo */}
      <div className="mb-4 flex items-center gap-4">
        {logoImage && (
          <div className="flex-shrink-0">
            <img 
              src={logoImage} 
              alt={`${title} logo`}
              className={
                title === "SJSU ASCE" 
                  ? "h-12 md:h-16 w-auto max-w-[160px] md:max-w-[200px] p-2 rounded-xl border-2 border-white/20 shadow-lg bg-black/20 project-logo object-contain"
                  : title.includes("UCSD")
                  ? "w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white/20 shadow-lg project-logo"
                  : "w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border-2 border-white/20 shadow-lg project-logo"
              }
            />
          </div>
        )}
        <div className="flex-1 flex items-baseline justify-between flex-wrap gap-4">
          <span className="text-white font-normal text-2xl md:text-3xl" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)' }}>
            {title}
          </span>
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
            >
              Open in new tab
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>

      <p 
        className="text-xl leading-relaxed text-white transition-colors duration-200 mb-6" 
        style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
      >
        {description}
      </p>

      {/* Live Embedded Website */}
      <motion.div
        className="rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black/40"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      >
        <div className="project-iframe-wrapper" style={{ height: '600px' }}>
          <iframe
            src={projectUrl}
            className="project-iframe"
            title={title}
            loading="lazy"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

