'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MusicGalleryProps {
	images: { id: number | string; title: string; desc: string; url: string; span: string }[];
}

const ImageCard = ({ image, index }: { image: { id: number | string; title: string; url: string }; index: number }) => {
	const [isLoaded, setIsLoaded] = React.useState(false);

	return (
		<motion.div
			key={image.id}
			initial={{ opacity: 0, y: 15 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ 
				duration: 0.35, 
				delay: index * 0.05,
				ease: [0.16, 1, 0.3, 1]
			}}
			className="aspect-square w-full cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-black/20 shadow-lg"
		>
			<motion.div
				className="relative h-full w-full"
				whileHover={{ scale: 1.02 }}
				transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
			>
				<img
					src={image.url}
					alt={image.title}
					onLoad={() => setIsLoaded(true)}
					className={`h-full w-full object-cover transition-all duration-400 ${
						isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
					}`}
				/>
				{!isLoaded && (
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
					</div>
				)}
			</motion.div>
		</motion.div>
	);
};

export function MusicGallery({ images }: MusicGalleryProps) {
	const [selectedImage, setSelectedImage] = React.useState<{ url: string; title: string } | null>(null);

	// Lock scroll when modal is open
	React.useEffect(() => {
		if (selectedImage) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [selectedImage]);

	return (
		<>
			<div className="relative flex w-full flex-col items-center justify-center py-12">
				<div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8 px-8 md:px-12 auto-rows-fr">
					{images.map((image, index) => (
						<div key={image.id} onClick={() => setSelectedImage({ url: image.url, title: image.title })}>
							<ImageCard image={image} index={index} />
						</div>
					))}
				</div>
			</div>

			{/* Lightbox Modal */}
			<AnimatePresence>
				{selectedImage && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						onClick={() => setSelectedImage(null)}
						className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 cursor-pointer"
						style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
					>
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.8, opacity: 0 }}
						transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
						onClick={(e) => e.stopPropagation()}
						className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
					>
							<img
								src={selectedImage.url}
								alt={selectedImage.title}
								className="w-[800px] h-[800px] object-cover rounded-lg"
							/>
							<button
								onClick={() => setSelectedImage(null)}
								className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl font-light w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors"
								aria-label="Close"
							>
								×
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

