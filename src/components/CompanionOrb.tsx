'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useElderLinkStore } from '@/store/useElderLinkStore';
import { useMemo } from 'react';

export const CompanionOrb = () => {
    const emotionalScore = useElderLinkStore((state) => state.emotionalScore);
    const voiceState = useElderLinkStore((state) => state.voiceState);

    const avgScore = (emotionalScore.loneliness + emotionalScore.confusion + emotionalScore.distress) / 3;

    const config = useMemo(() => {
        if (avgScore < 30) {
            return {
                baseColor: '#5B9BD5',
                glowColor: 'rgba(91, 155, 213, 0.4)',
                secondaryColor: 'rgba(91, 155, 213, 0.3)',
                speed: 8,
                scale: 1,
            };
        } else if (avgScore < 70) {
            return {
                baseColor: '#F4A460',
                glowColor: 'rgba(244, 164, 96, 0.4)',
                secondaryColor: 'rgba(244, 164, 96, 0.3)',
                speed: 4,
                scale: 1.1,
            };
        } else {
            return {
                baseColor: '#9B7EBD',
                glowColor: 'rgba(155, 126, 189, 0.4)',
                secondaryColor: 'rgba(155, 126, 189, 0.3)',
                speed: 2,
                scale: 1.2,
            };
        }
    }, [avgScore]);

    const orbVariants: any = {
        idle: {
            scale: config.scale,
            rotate: 0,
            transition: { duration: 4, ease: "easeInOut" }
        },
        listening: {
            scale: config.scale * 1.05,
            rotate: [0, 3, -3, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        },
        speaking: {
            scale: [config.scale, config.scale * 1.1, config.scale],
            transition: {
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
            }
        },
        processing: {
            scale: config.scale,
            rotate: 360,
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    return (
        <div className="relative flex items-center justify-center w-80 h-80">
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <filter id="fluid">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="fluid" />
                </filter>
            </svg>

            <motion.div
                variants={orbVariants}
                animate={voiceState}
                className="relative w-full h-full flex items-center justify-center"
                style={{ filter: 'url(#fluid)' }}
            >
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: config.speed * 2,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute w-64 h-64 rounded-full opacity-30"
                    style={{ background: `linear-gradient(45deg, ${config.baseColor}, ${config.secondaryColor})` }}
                />

                <motion.div
                    animate={{
                        scale: [1.1, 0.9, 1.1],
                    }}
                    transition={{
                        duration: config.speed,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute w-48 h-48 rounded-full opacity-40 blur-xl"
                    style={{ backgroundColor: config.baseColor }}
                />

                <div className="relative w-40 h-40 rounded-full glass border border-white/20 flex items-center justify-center shadow-2xl overflow-hidden">
                    <motion.div
                        className="absolute inset-0 opacity-20"
                        animate={{
                            background: [
                                `radial-gradient(circle at 20% 20%, ${config.baseColor} 0%, transparent 50%)`,
                                `radial-gradient(circle at 80% 80%, ${config.baseColor} 0%, transparent 50%)`,
                                `radial-gradient(circle at 20% 20%, ${config.baseColor} 0%, transparent 50%)`
                            ]
                        }}
                        transition={{ duration: config.speed * 3, repeat: Infinity }}
                    />

                    <AnimatePresence mode="wait">
                        <motion.span
                            key={voiceState}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 0.5, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-xs font-bold uppercase tracking-widest z-10"
                        >
                            {voiceState === 'idle' ? 'ElderLink' : voiceState}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </motion.div>

            <div
                className="absolute inset-0 rounded-full blur-[100px] -z-10 transition-colors duration-2000"
                style={{ backgroundColor: config.glowColor }}
            />
        </div>
    );
};
