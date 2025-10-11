'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MusicGalleryProps {
	images: { 
		id: number | string; 
		title: string; 
		desc: string; 
		url: string; 
		fullSizeUrl?: string;
		span: string; 
		link?: string;
		location?: { lat: number; lng: number; name: string; url?: string };
	}[];
	sizeVariant?: 'normal' | 'large';
	enableLinks?: boolean;
	enableGoogleEarth?: boolean;
}

const ImageCard = ({ 
	image, 
	index, 
	sizeVariant
}: { 
	image: { 
		id: number | string; 
		title: string; 
		url: string;
		location?: { lat: number; lng: number; name: string; url?: string };
	}; 
	index: number; 
	sizeVariant?: 'normal' | 'large';
}) => {
	const [isLoaded, setIsLoaded] = React.useState(false);
	const [isInView, setIsInView] = React.useState(false);
	const imgRef = React.useRef<HTMLDivElement>(null);
	// Match reference: thick white borders with prominent rounded corners
	const borderRadius = 'rounded-2xl';
	const borderWidth = 'border-[4px]';

	// Optimized Intersection Observer with staggered loading
	React.useEffect(() => {
		if (!imgRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					// Stagger image loading to reduce simultaneous requests
					const delay = index * 30; // 30ms delay per image
					setTimeout(() => {
						setIsInView(true);
					}, delay);
					observer.disconnect();
				}
			},
			{
				rootMargin: '200px', // Balanced for smooth loading
				threshold: 0.01
			}
		);

		observer.observe(imgRef.current);

		return () => observer.disconnect();
	}, [index]);

	return (
		<div
			ref={imgRef}
			className={`aspect-square w-full cursor-pointer overflow-hidden ${borderRadius} ${borderWidth} border-white/30 bg-black/20 transition-all duration-200 ${isInView ? 'opacity-100' : 'opacity-0'}`}
			style={{ 
				willChange: isInView ? 'auto' : 'opacity',
				boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
				backfaceVisibility: 'hidden',
				WebkitBackfaceVisibility: 'hidden'
			}}
		>
			<div
				className="relative h-full w-full transition-transform duration-200 ease-out hover:scale-[1.03]"
				style={{ 
					backfaceVisibility: 'hidden',
					WebkitBackfaceVisibility: 'hidden'
				}}
			>
				{isInView ? (
					<>
						<img
							src={image.url}
							alt={image.title}
							loading="eager"
							decoding="async"
							fetchPriority="high"
							onLoad={() => setIsLoaded(true)}
							className={`h-full w-full object-cover transition-opacity duration-200 ${
								isLoaded ? 'opacity-100' : 'opacity-0'
							}`}
							style={{ 
								imageRendering: 'auto',
								WebkitUserSelect: 'none',
								userSelect: 'none',
								backfaceVisibility: 'hidden',
								WebkitBackfaceVisibility: 'hidden'
							} as React.CSSProperties}
						/>
						{!isLoaded && (
							<div className="absolute inset-0 bg-white/5" />
						)}
					</>
				) : (
					<div className="absolute inset-0 bg-white/5" />
				)}
			</div>
		</div>
	);
};

export const MusicGallery = React.memo(function MusicGallery({ 
	images, 
	sizeVariant = 'normal', 
	enableLinks = false,
	enableGoogleEarth = false 
}: MusicGalleryProps) {
	const [selectedImage, setSelectedImage] = React.useState<{ 
		url: string; 
		title: string; 
		location?: { lat: number; lng: number; name: string; url?: string };
		index: number;
	} | null>(null);
	const [visibleCount, setVisibleCount] = React.useState(6); // Load 6 images initially
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [touchStart, setTouchStart] = React.useState<number | null>(null);
	const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

	// Lock scroll when modal is open - optimized
	React.useEffect(() => {
		if (selectedImage) {
			document.body.style.overflow = 'hidden';
			document.body.style.touchAction = 'none';
		} else {
			document.body.style.overflow = '';
			document.body.style.touchAction = '';
		}
		
		return () => {
			document.body.style.overflow = '';
			document.body.style.touchAction = '';
		};
	}, [selectedImage]);

	// Progressive loading - load remaining images after initial render
	React.useEffect(() => {
		if (images.length > visibleCount) {
			const timer = setTimeout(() => {
				setVisibleCount(images.length);
			}, 300); // Load rest after 300ms
			
			return () => clearTimeout(timer);
		}
	}, [images.length, visibleCount]);

	// Keyboard navigation
	React.useEffect(() => {
		if (!selectedImage) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				const prevIndex = (selectedImage.index - 1 + images.length) % images.length;
				const prevImage = images[prevIndex];
				setSelectedImage({
					url: prevImage.fullSizeUrl || prevImage.url,
					title: prevImage.title,
					location: prevImage.location,
					index: prevIndex
				});
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
				const nextIndex = (selectedImage.index + 1) % images.length;
				const nextImage = images[nextIndex];
				setSelectedImage({
					url: nextImage.fullSizeUrl || nextImage.url,
					title: nextImage.title,
					location: nextImage.location,
					index: nextIndex
				});
			} else if (e.key === 'Escape') {
				e.preventDefault();
				setSelectedImage(null);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [selectedImage, images]);

	// Preload adjacent images for instant navigation
	React.useEffect(() => {
		if (selectedImage) {
			const currentIndex = selectedImage.index;
			const prevIndex = (currentIndex - 1 + images.length) % images.length;
			const nextIndex = (currentIndex + 1) % images.length;
			
			// Preload previous and next images (use fullSizeUrl if available)
			[prevIndex, nextIndex].forEach(idx => {
				const img = new Image();
				img.src = images[idx].fullSizeUrl || images[idx].url;
			});
		}
	}, [selectedImage, images]);

	const handleImageClick = (image: typeof images[0], index: number) => {
		if (enableLinks && image.link) {
			window.open(image.link, '_blank', 'noopener,noreferrer');
		} else {
			setSelectedImage({ 
				url: image.fullSizeUrl || image.url, 
				title: image.title,
				location: image.location,
				index
			});
		}
	};

	const handlePrevImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (selectedImage) {
			const newIndex = (selectedImage.index - 1 + images.length) % images.length;
			const newImage = images[newIndex];
			setSelectedImage({
				url: newImage.fullSizeUrl || newImage.url,
				title: newImage.title,
				location: newImage.location,
				index: newIndex
			});
		}
	};

	const handleNextImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (selectedImage) {
			const newIndex = (selectedImage.index + 1) % images.length;
			const newImage = images[newIndex];
			setSelectedImage({
				url: newImage.fullSizeUrl || newImage.url,
				title: newImage.title,
				location: newImage.location,
				index: newIndex
			});
		}
	};

	const handleGoogleEarthClick = (location: { lat: number; lng: number; name: string; url?: string }) => {
		// Use custom URL if provided, otherwise construct Google Earth Web URL
		const googleEarthUrl = location.url || `https://earth.google.com/web/@${location.lat},${location.lng},0a,1000d,35y,0h,0t,0r`;
		window.open(googleEarthUrl, '_blank', 'noopener,noreferrer');
	};

	// Touch/swipe handlers for mobile slider
	const minSwipeDistance = 50;

	const onTouchStart = (e: React.TouchEvent) => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientX);
	};

	const onTouchMove = (e: React.TouchEvent) => {
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) return;
		
		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;

		if (isLeftSwipe && selectedImage) {
			// Swipe left = next image
			const nextIndex = (selectedImage.index + 1) % images.length;
			const nextImage = images[nextIndex];
			setSelectedImage({
				url: nextImage.fullSizeUrl || nextImage.url,
				title: nextImage.title,
				location: nextImage.location,
				index: nextIndex
			});
		} else if (isRightSwipe && selectedImage) {
			// Swipe right = previous image
			const prevIndex = (selectedImage.index - 1 + images.length) % images.length;
			const prevImage = images[prevIndex];
			setSelectedImage({
				url: prevImage.fullSizeUrl || prevImage.url,
				title: prevImage.title,
				location: prevImage.location,
				index: prevIndex
			});
		}
	};

	// Optimized grid layout for mobile-first design
	const maxWidth = 'max-w-[1400px]';
	const gap = 'gap-4 md:gap-6';
	const gridCols = 'grid-cols-2 md:grid-cols-3';
	const padding = 'px-4 md:px-6 lg:px-8';

	return (
		<>
			<div 
				ref={containerRef}
				className="relative w-full py-8 md:py-12"
			>
				<div 
					className={`mx-auto grid w-full ${maxWidth} ${gridCols} ${gap} ${padding}`}
					style={{ 
						gridAutoRows: '1fr'
					}}
				>
				{images.slice(0, visibleCount).map((image, index) => (
					<div 
						key={image.id} 
						onClick={() => handleImageClick(image, index)}
					>
						<ImageCard 
							image={image} 
							index={index} 
							sizeVariant={sizeVariant}
						/>
					</div>
				))}
				</div>
			</div>

			{/* Lightbox Modal - Clean Implementation */}
			<AnimatePresence mode="wait">
				{selectedImage && (
					<>
						{/* Overlay Background */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="fixed inset-0 z-[9999] bg-black/95"
							onClick={() => setSelectedImage(null)}
						/>

						{/* Modal Content Container */}
						<div 
							className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none"
							onTouchStart={onTouchStart}
							onTouchMove={onTouchMove}
							onTouchEnd={onTouchEnd}
						>
							{/* Close Button */}
							<button
								onClick={() => setSelectedImage(null)}
								className="pointer-events-auto fixed top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all text-white text-2xl z-[10001]"
								aria-label="Close"
							>
								×
							</button>

							{/* Previous Button */}
							<button
								onClick={(e) => {
									e.stopPropagation();
									handlePrevImage(e);
								}}
								className="pointer-events-auto fixed left-4 top-1/2 -translate-y-1/2 md:left-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all text-white z-[10001]"
								aria-label="Previous"
							>
								<ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
							</button>

							{/* Next Button */}
							<button
								onClick={(e) => {
									e.stopPropagation();
									handleNextImage(e);
								}}
								className="pointer-events-auto fixed right-4 top-1/2 -translate-y-1/2 md:right-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all text-white z-[10001]"
								aria-label="Next"
							>
								<ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
							</button>

							{/* Fixed Frame Container */}
							<div 
								className="pointer-events-auto"
								style={{
									position: 'fixed',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '0.5rem',
									padding: '2rem'
								}}
								onClick={(e) => e.stopPropagation()}
							>
								{/* Counter */}
								<div className="text-white/50 text-xs md:text-sm font-light flex-shrink-0 mb-1">
									{selectedImage.index + 1} / {images.length}
								</div>

								{/* Image Frame - Fixed Size */}
								<motion.div
									key={selectedImage.url}
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.95 }}
									transition={{ duration: 0.2 }}
									className="relative flex items-center justify-center"
									style={{
										flex: 1,
										width: '100%',
										overflow: 'hidden'
									}}
								>
									<img
										src={selectedImage.url}
										alt={selectedImage.title}
										className="rounded-lg"
										style={{ 
											maxWidth: '100%',
											maxHeight: '100%',
											width: 'auto',
											height: 'auto',
											objectFit: 'contain',
											boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
										}}
									/>
								</motion.div>
							</div>

							{/* Google Earth Button - Fixed at Bottom Center */}
							{enableGoogleEarth && selectedImage.location && (
								<div 
									className="pointer-events-auto fixed bottom-6 left-0 right-0 flex items-center justify-center z-[10001]"
								>
									<motion.button
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.15 }}
										onClick={(e) => {
											e.stopPropagation();
											if (selectedImage.location) {
												handleGoogleEarthClick(selectedImage.location);
											}
										}}
										className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all text-white text-sm"
									>
										<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<circle cx="12" cy="12" r="10"></circle>
											<line x1="2" y1="12" x2="22" y2="12"></line>
											<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
										</svg>
										<span>Travel to {selectedImage.location.name}</span>
									</motion.button>
								</div>
							)}
						</div>
					</>
				)}
			</AnimatePresence>
		</>
	);
});

