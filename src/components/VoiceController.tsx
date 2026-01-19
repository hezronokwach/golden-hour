'use client';

import { useHume } from '@/hooks/useHumeHandler';
import { Mic, MicOff, PhoneOff, Play, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmotionVisualizer } from './EmotionVisualizer';

export const VoiceController = () => {
    const {
        status,
        isMicMuted,
        error,
        startSession,
        endSession,
        toggleMic,
        emotions
    } = useHume();

    const isActive = status === 'ACTIVE';
    const isConnecting = status === 'CONNECTING';

    return (
        <div className="w-full flex flex-col items-center gap-4 transition-all duration-500">
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{
                            type: 'spring',
                            damping: 20,
                            stiffness: 300
                        }}
                    >
                        <EmotionVisualizer emotions={emotions} />
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-alert/10 border border-alert/20 px-4 py-2 rounded-full text-alert text-sm flex items-center gap-2 shadow-lg backdrop-blur-md"
                >
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                </motion.div>
            )}

            <div className="w-full flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200 p-3 rounded-full shadow-lg">
                {!isActive ? (
                    <button
                        onClick={() => startSession()}
                        disabled={isConnecting}
                        className={`flex items-center justify-center gap-4 w-full py-5 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-500 shadow-lg ${isConnecting
                            ? 'bg-gray-200 text-gray-400'
                            : 'bg-calm text-white hover:bg-calm/90 hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                    >
                        {isConnecting ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
                        ) : (
                            <Play className="w-4 h-4 fill-current" />
                        )}
                        {isConnecting ? 'Connecting' : 'Start Session'}
                    </button>
                ) : (
                    <div className="flex items-center justify-between w-full px-2">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleMic}
                                className={`p-4 rounded-full transition-all duration-300 shadow-lg ${isMicMuted
                                    ? 'bg-alert text-white hover:bg-alert/90 hover:scale-110'
                                    : 'bg-calm text-white hover:bg-calm/90 hover:scale-110'
                                    }`}
                            >
                                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>
                            <span className="text-sm font-semibold text-gray-600">
                                {isMicMuted ? 'Muted' : 'Listening'}
                            </span>
                        </div>

                        <div className="w-px h-8 bg-gray-300 mx-2" />

                        <button
                            onClick={endSession}
                            className="flex items-center gap-3 px-6 py-4 rounded-full bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-300"
                        >
                            <span className="text-sm font-semibold uppercase tracking-wider">End</span>
                            <PhoneOff className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    className="text-xs uppercase tracking-wider font-semibold text-gray-500"
                >
                    ElderLink Active
                </motion.div>
            )}
        </div>
    );
};
