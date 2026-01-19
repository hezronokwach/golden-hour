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
            hour12: true,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full h-full flex items-center justify-center"
        >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 w-full max-w-2xl relative">
                <button
                    onClick={clearIntervention}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="text-center">
                    {(context === 'time' || !context) && (
                        <motion.div
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-7xl font-bold text-blue-600 mb-6"
                        >
                            {formatTime(currentTime)}
                        </motion.div>
                    )}

                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        {formatDate(currentTime)}
                    </h2>

                    <div className="bg-white/60 rounded-xl p-6 mb-6">
                        <p className="text-2xl text-gray-700 leading-relaxed">
                            {getContextMessage()}
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 text-xl text-gray-600">
                        <span>🌤️</span>
                        <span>Everything is okay</span>
                        <span>💙</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
