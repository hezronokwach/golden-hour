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
            console.log('Loading audio:', currentSong.url);
            audioRef.current.load();
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Audio playing successfully');
                        setIsPlaying(true);
                    })
                    .catch(err => {
                        console.warn('Audio autoplay blocked or failed:', err);
                        console.log('Click the play button to start music');
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8"
        >
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl p-12 max-w-2xl w-full relative">
                <button
                    onClick={clearIntervention}
                    className="absolute top-6 right-6 w-14 h-14 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                >
                    <X size={32} />
                </button>

                <div className="text-center mb-12">
                    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-purple-300 to-blue-300 rounded-full mb-8 flex items-center justify-center">
                        <span className="text-8xl">🎵</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-3">{currentSong.title}</h2>
                    <p className="text-3xl text-gray-600">{currentSong.artist}</p>
                </div>

                <div className="flex items-center justify-center gap-6">
                    <button
                        onClick={playPrevious}
                        className="w-20 h-20 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-lg"
                    >
                        <SkipBack size={40} />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="w-28 h-28 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors shadow-xl"
                    >
                        {isPlaying ? <Pause size={56} className="text-white" /> : <Play size={56} className="text-white ml-2" />}
                    </button>

                    <button
                        onClick={playNext}
                        className="w-20 h-20 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-lg"
                    >
                        <SkipForward size={40} />
                    </button>
                </div>

                <audio
                    ref={audioRef}
                    src={currentSong.url}
                    onEnded={playNext}
                    onPlay={() => {
                        console.log('Audio started playing');
                        setIsPlaying(true);
                    }}
                    onPause={() => {
                        console.log('Audio paused');
                        setIsPlaying(false);
                    }}
                    onError={(e) => {
                        console.error('Audio error:', e);
                        console.error('Failed to load:', currentSong.url);
                        console.log('Supported formats: MP3, WAV, OGG, M4A');
                    }}
                    onLoadedData={() => console.log('Audio loaded successfully')}
                />
            </div>
        </motion.div>
    );
};
