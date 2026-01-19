'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface EmotionVisualizerProps {
    emotions: Record<string, number>;
}

export const EmotionVisualizer = ({ emotions }: EmotionVisualizerProps) => {
    // Sort and get top 8 emotions for a richer display
    const topEmotions = Object.entries(emotions)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .filter(([, score]) => score > 0.02);

    if (topEmotions.length === 0) return null;

    return (
        <div className="flex flex-col gap-3 p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 w-full shadow-lg">
            <div className="flex justify-between items-center mb-1 px-1">
                <span className="text-xs font-semibold text-gray-700">Emotional Resonance</span>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-calm shadow-sm" />
                    <div className="w-2 h-2 rounded-full bg-concern shadow-sm" />
                    <div className="w-2 h-2 rounded-full bg-alert shadow-sm" />
                </div>
            </div>

            <AnimatePresence mode="popLayout">
                {topEmotions.map(([emotion, score]) => {
                    const isStress = ['Anxiety', 'Distress', 'Confusion', 'Fear', 'Sorrow'].includes(emotion);
                    const isCalm = ['Calmness', 'Contentment', 'Relief', 'Satisfaction'].includes(emotion);

                    const colorClass = isStress ? 'bg-alert' : isCalm ? 'bg-calm' : 'bg-concern';
                    const glowClass = isStress ? 'shadow-[0_0_15px_rgba(155,126,189,0.4)]' : isCalm ? 'shadow-[0_0_15px_rgba(91,155,213,0.4)]' : 'shadow-[0_0_15px_rgba(244,164,96,0.4)]';

                    return (
                        <motion.div
                            key={emotion}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            className="space-y-1.5"
                        >
                            <div className="flex justify-between items-end px-1">
                                <span className="text-sm font-semibold text-gray-700 capitalize">{emotion}</span>
                                <span className="text-xs text-gray-500">{(score * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${score * 100}%` }}
                                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                                    className={`h-full rounded-full transition-colors duration-500 ${colorClass} ${glowClass}`}
                                    style={{ opacity: 0.5 + (score * 0.5) }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};
