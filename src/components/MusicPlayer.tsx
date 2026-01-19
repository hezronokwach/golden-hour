'use client';

import { motion } from 'framer-motion';
import { useElderLinkStore } from '@/store/useElderLinkStore';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export const MusicPlayer = () => {
    const { userProfile, activeIntervention, clearIntervention } = useElderLinkStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const preference = activeIntervention.params?.preference;
    const currentSong = preference && preference !== 'favorite'
        ? userProfile.favoriteSongs.find(s => s.title === preference) || userProfile.favoriteSongs[0]
        : userProfile.favoriteSongs[currentIndex];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(err => {
                        console.warn('Audio autoplay blocked:', err);
                        setIsPlaying(false);
                    });
            }
        }
    }, [currentSong.url]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const playNext = () => {
        const nextIndex = (currentIndex + 1) % userProfile.favoriteSongs.length;
        setCurrentIndex(nextIndex);
        if (audioRef.current) {
            audioRef.current.load();
            audioRef.current.play().catch(err => console.warn('Play failed:', err));
        }
    };

    const playPrevious = () => {
        const prevIndex = currentIndex === 0 ? userProfile.favoriteSongs.length - 1 : currentIndex - 1;
        setCurrentIndex(prevIndex);
        if (audioRef.current) {
            audioRef.current.load();
            audioRef.current.play().catch(err => console.warn('Play failed:', err));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full h-full flex items-center justify-center"
        >
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8 w-full max-w-md relative">
                <button
                    onClick={clearIntervention}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-8">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-300 to-blue-300 rounded-full mb-6 flex items-center justify-center">
                        <span className="text-6xl">🎵</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentSong.title}</h2>
                    <p className="text-2xl text-gray-600">{currentSong.artist}</p>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={playPrevious}
                        className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-lg"
                    >
                        <SkipBack size={28} />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="w-20 h-20 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors shadow-xl"
                    >
                        {isPlaying ? <Pause size={40} className="text-white" /> : <Play size={40} className="text-white ml-1" />}
                    </button>

                    <button
                        onClick={playNext}
                        className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-lg"
                    >
                        <SkipForward size={28} />
                    </button>
                </div>

                <audio
                    ref={audioRef}
                    src={currentSong.url}
                    onEnded={playNext}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />
            </div>
        </motion.div>
    );
};
