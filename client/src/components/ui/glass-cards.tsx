import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cardData } from '../../lib/utils';
import { LinkPreview } from './link-preview';
import { MusicGallery } from './music-gallery';

gsap.registerPlugin(ScrollTrigger);

interface CardProps {
    id: number;
    title: string;
    description: string;
    index: number;
    totalCards: number;
    color: string;
    content?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, description, index, totalCards, color, content }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        const container = containerRef.current;
        if (!card || !container) return;

        const targetScale = 1 - (totalCards - index) * 0.05;

        // Set initial state
        gsap.set(card, {
            scale: 1,
            transformOrigin: "center top"
        });

        // Create scroll trigger for stacking effect
        ScrollTrigger.create({
            trigger: container,
            start: "top center",
            end: "bottom center",
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const scale = gsap.utils.interpolate(1, targetScale, progress);

                gsap.set(card, {
                    scale: Math.max(scale, targetScale),
                    transformOrigin: "center top"
                });
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [index, totalCards]);

    return (
        <div
            ref={containerRef}
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'sticky',
                top: 0,
                paddingTop: '2rem',
                paddingBottom: '2rem'
            }}
        >
            <div
                ref={cardRef}
                style={{
                    position: 'relative',
                    width: '90%',
                    maxWidth: '900px',
                    minHeight: '500px',
                    borderRadius: '24px',
                    isolation: 'isolate',
                    top: `calc(-5vh + ${index * 25}px)`,
                    transformOrigin: 'top'
                }}
                className="card-content"
            >
                {/* Electric Border Effect */}
                <div
                    style={{
                        position: 'absolute',
                        inset: '-3px',
                        borderRadius: '27px',
                        padding: '3px',
                        background: `conic-gradient(
                            from 0deg,
                            transparent 0deg,
                            ${color} 60deg,
                            ${color.replace('0.8', '0.6')} 120deg,
                            transparent 180deg,
                            ${color.replace('0.8', '0.4')} 240deg,
                            transparent 360deg
                        )`,
                        zIndex: -1
                    }}
                />

                {/* Main Card Content */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    minHeight: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '24px',
                    background: `
                        linear-gradient(145deg, 
                            rgba(255, 255, 255, 0.1), 
                            rgba(255, 255, 255, 0.05)
                        )
                    `,
                    backdropFilter: 'blur(25px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: `
                        0 8px 32px rgba(0, 0, 0, 0.3),
                        0 2px 8px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        inset 0 -1px 0 rgba(255, 255, 255, 0.1)
                    `,
                    overflow: 'hidden'
                }}>
                    {/* Enhanced Glass reflection overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '60%',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
                        pointerEvents: 'none',
                        borderRadius: '24px 24px 0 0'
                    }} />

                    {/* Glass shine effect */}
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        right: '10px',
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
                        borderRadius: '1px',
                        pointerEvents: 'none'
                    }} />

                    {/* Side glass reflection */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '2px',
                        height: '100%',
                        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%)',
                        borderRadius: '24px 0 0 24px',
                        pointerEvents: 'none'
                    }} />

                    {/* Frosted glass texture */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `
                            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 2px),
                            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 1px, transparent 2px),
                            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.06) 1px, transparent 2px)
                        `,
                        backgroundSize: '30px 30px, 25px 25px, 35px 35px',
                        pointerEvents: 'none',
                        borderRadius: '24px',
                        opacity: 0.7
                    }} />

                    {/* Content */}
                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        padding: '3rem 2.5rem',
                        height: '100%',
                        overflowY: 'auto'
                    }}>
                        <h2 className="text-4xl md:text-5xl font-light mb-8 text-white">{title}</h2>
                        <div className="text-white">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface StackedCardsProps {
    photoGalleryImages: any[];
    musicLibraryImages: any[];
    friendsImages: any[];
}

export const StackedCards: React.FC<StackedCardsProps> = ({ 
    photoGalleryImages, 
    musicLibraryImages, 
    friendsImages 
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        gsap.fromTo(container,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 1.2,
                ease: "power2.out"
            }
        );
    }, []);

    const cardsContent: Record<number, React.ReactNode> = {
        1: (
            <div className="space-y-6 text-xl md:text-2xl leading-relaxed">
                <p>
                    I'm a sophomore at <LinkPreview imageSrc="/attached_assets/UCSD.png" imageAlt="UCSD" className="text-white font-normal underline decoration-white/30 hover:decoration-white/60 underline-offset-4" width={256} height={256}>UCSD</LinkPreview> studying Cognitive Science specializing in Machine Learning and Neural Computation.
                </p>
                <p>
                    You can probably find me hanging out with friends or building a new side-project that I randomly decided to think was cool.
                </p>
                <p>
                    I am currently serving as Vice President of Education at <LinkPreview imageSrc="/attached_assets/MTC.png" imageAlt="Muslim Tech Collaborative" className="text-white font-normal underline decoration-white/30 hover:decoration-white/60 underline-offset-4" width={256} height={256}>Muslim Tech Collaborative</LinkPreview> and Vice President of <LinkPreview imageSrc="/attached_assets/ALM.png" imageAlt="Alpha Lambda Mu" className="text-white font-normal underline decoration-white/30 hover:decoration-white/60 underline-offset-4" width={256} height={256}>Alpha Lambda Mu</LinkPreview>.
                </p>
            </div>
        ),
        2: (
            <div className="space-y-8">
                <div>
                    <LinkPreview 
                        imageSrc="/attached_assets/TheologyLLMEval.png" 
                        imageAlt="Theology LLM Evaluation"
                        url="https://mcc-genai-guild.vercel.app"
                        width={256}
                        height={256}
                    >
                        <a 
                            href="https://mcc-genai-guild.vercel.app" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white font-normal underline decoration-white/30 hover:decoration-white/60 underline-offset-4 text-xl md:text-2xl"
                        >
                            Theology LLM Evaluation
                        </a>
                    </LinkPreview>
                    <p className="mt-3 text-lg md:text-xl leading-relaxed">
                        Comprehensive evaluation framework benchmarking large language models on theological reasoning across five world religions.
                    </p>
                </div>
                
                <div>
                    <LinkPreview 
                        imageSrc="/attached_assets/REINFORCEMENTLEARNING.PNG" 
                        imageAlt="Reinforcement Learning Research"
                        url="https://github.com/zahiraIi/ML-Lab-Summer-2025-UCSD"
                        width={256}
                        height={256}
                    >
                        <a 
                            href="https://github.com/zahiraIi/ML-Lab-Summer-2025-UCSD" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white font-normal text-xl md:text-2xl underline decoration-white/30 hover:decoration-white/60 underline-offset-4"
                        >
                            UCSD Living Matter Lab: Machine Learning Research
                        </a>
                    </LinkPreview>
                    <p className="mt-3 text-lg md:text-xl leading-relaxed">
                        Implementation and analysis of reinforcement learning for robotic swarm navigation, exploring centralized vs decentralized control in complex environments.
                    </p>
                </div>
            
                <div>
                    <LinkPreview 
                        imageSrc="/attached_assets/TritonGuard.png" 
                        imageAlt="TritonGuard"
                        url="https://github.com/zahiraIi/TritionGuard"
                        width={256}
                        height={256}
                    >
                        <a 
                            href="https://github.com/zahiraIi/TritionGuard" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white font-normal underline decoration-white/30 hover:decoration-white/60 underline-offset-4 text-xl md:text-2xl"
                        >
                            TritonGuard
                        </a>
                    </LinkPreview>
                    <p className="mt-3 text-lg md:text-xl leading-relaxed">
                        Community safety app for students at risk, enabling anonymous reporting. Scaled to UC campuses statewide with UCSA.
                    </p>
                </div>
                
                <div>
                    <LinkPreview 
                        imageSrc="/attached_assets/ApplyPal.png" 
                        imageAlt="ApplyPal"
                        width={256}
                        height={256}
                    >
                        <span className="text-white font-normal text-xl md:text-2xl underline decoration-white/30 hover:decoration-white/60 underline-offset-4">ApplyPal</span>
                    </LinkPreview>
                    <p className="mt-3 text-lg md:text-xl leading-relaxed">
                        AI-powered email generator that helps students tailor outreach using resume parsing and web scraping with automatic follow-ups.
                    </p>
                </div>
            
                <div>
                    <LinkPreview 
                        imageSrc="/attached_assets/ASCE_logo.png" 
                        imageAlt="SJSU ASCE"
                        url="https://sjsu-asce-website.vercel.app"
                        width={256}
                        height={256}
                    >
                        <a 
                            href="https://sjsu-asce-website.vercel.app" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white font-normal underline decoration-white/30 hover:decoration-white/60 underline-offset-4 text-xl md:text-2xl"
                        >
                            SJSU ASCE
                        </a>
                    </LinkPreview>
                    <p className="mt-3 text-lg md:text-xl leading-relaxed">
                        Responsive website with Google Sheets API integration for real-time donation tracking and automated membership processing.
                    </p>
                </div>
            </div>
        ),
        3: <MusicGallery images={photoGalleryImages} />,
        4: <MusicGallery images={musicLibraryImages} />,
        5: <MusicGallery images={friendsImages} />
    };

    return (
        <div ref={containerRef}>
            {cardData.map((card, index) => (
                <Card
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    description={card.description}
                    index={index}
                    totalCards={cardData.length}
                    color={card.color}
                    content={cardsContent[card.id]}
                />
            ))}
        </div>
    );
};

