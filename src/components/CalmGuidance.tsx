'use client';

import { motion } from 'framer-motion';
import { useElderLinkStore } from '@/store/useElderLinkStore';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export const CalmGuidance = () => {
    const { activeIntervention, clearIntervention, userProfile } = useElderLinkStore();
    const [currentTime, setCurrentTime] = useState(new Date());

    const context = activeIntervention.params?.context || 'time';

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getTimeOfDay = (date: Date) => {
        const hour = date.getHours();
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        return 'evening';
    };

    const getContextMessage = () => {
        const timeOfDay = getTimeOfDay(currentTime);
        
        switch (context) {
            case 'time':
                return `It's ${formatTime(currentTime)} in the ${timeOfDay}`;
            case 'date':
                return `Today is ${formatDate(currentTime)}`;
            case 'schedule':
                return `It's ${timeOfDay}. Your family usually visits around 5 PM`;
            case 'location':
                return `You're at home in your living room, ${userProfile.name}`;
            default:
                return `It's ${formatTime(currentTime)} on ${formatDate(currentTime)}`;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8"
        >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-12 max-w-3xl w-full relative">
                <button
                    onClick={clearIntervention}
                    className="absolute top-6 right-6 w-14 h-14 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                >
                    <X size={32} />
                </button>

                <div className="text-center">
                    {(context === 'time' || !context) && (
                        <motion.div
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-9xl font-bold text-blue-600 mb-8"
                        >
                            {formatTime(currentTime)}
                        </motion.div>
                    )}

                    <h2 className="text-5xl font-bold text-gray-800 mb-6">
                        {formatDate(currentTime)}
                    </h2>

                    <div className="bg-white/60 rounded-2xl p-8 mb-8">
                        <p className="text-4xl text-gray-700 leading-relaxed">
                            {getContextMessage()}
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-2xl text-gray-600">
                        <span>🌤️</span>
                        <span>Everything is okay</span>
                        <span>💙</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
