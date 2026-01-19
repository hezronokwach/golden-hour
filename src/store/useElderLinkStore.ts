import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export interface FamilyMember {
    name: string;
    relation: string;
    photo: string;
}

export interface Song {
    title: string;
    artist: string;
    url: string;
}

interface ElderLinkState {
    emotionalScore: {
        loneliness: number;
        confusion: number;
        distress: number;
    };
    voiceState: 'idle' | 'listening' | 'speaking' | 'processing';
    sessionHistory: { time: string; loneliness: number; confusion: number; distress: number }[];
    activeIntervention: {
        type: 'none' | 'photos' | 'music' | 'family_alert' | 'calm_guidance' | 'calm_activity';
        params?: Record<string, string>;
    };
    userProfile: {
        name: string;
        familyMembers: FamilyMember[];
        favoriteSongs: Song[];
    };

    // Actions
    setEmotionalScores: (loneliness: number, confusion: number, distress: number) => void;
    setVoiceState: (state: ElderLinkState['voiceState']) => void;
    triggerIntervention: (type: ElderLinkState['activeIntervention']['type'], params?: Record<string, string>) => void;
    clearIntervention: () => void;
    addSessionData: (data: { time: string; loneliness: number; confusion: number; distress: number }) => void;
    resetSession: () => void;
}

export const useElderLinkStore = create<ElderLinkState>()(
    devtools(
        persist(
            (set) => ({
                emotionalScore: {
                    loneliness: 0,
                    confusion: 0,
                    distress: 0,
                },
                voiceState: 'idle',
                activeIntervention: {
                    type: 'none',
                },
                userProfile: {
                    name: 'Mary',
                    familyMembers: [
                        { name: 'Sarah', relation: 'Daughter', photo: '/demo/sarah.jpg' },
                        { name: 'Michael', relation: 'Son', photo: '/demo/michael.jpg' },
                        { name: 'Emma', relation: 'Granddaughter', photo: '/demo/emma.jpg' },
                        { name: 'Jack', relation: 'Grandson', photo: '/demo/jack.jpg' },
                    ],
                    favoriteSongs: [
                        { title: 'Fly Me to the Moon', artist: 'Frank Sinatra', url: '/demo/song1.mp3' },
                        { title: 'What a Wonderful World', artist: 'Louis Armstrong', url: '/demo/song2.mp3' },
                        { title: 'Unforgettable', artist: 'Nat King Cole', url: '/demo/song3.mp3' },
                    ],
                },
                sessionHistory: [],

                setEmotionalScores: (loneliness, confusion, distress) => set((state) => ({
                    emotionalScore: { loneliness, confusion, distress },
                    sessionHistory: [...state.sessionHistory, { 
                        time: new Date().toLocaleTimeString(), 
                        loneliness, 
                        confusion, 
                        distress 
                    }].slice(-20)
                })),

                setVoiceState: (voiceState) => set({ voiceState }),

                triggerIntervention: (type, params) => {
                    console.warn(`[ELDERLINK] Triggering intervention: ${type}`, params);
                    set({ activeIntervention: { type, params } });
                },

                clearIntervention: () => set({ activeIntervention: { type: 'none' } }),

                addSessionData: (data) => set((state) => ({
                    sessionHistory: [...state.sessionHistory, data].slice(-20),
                })),

                resetSession: () => set({ 
                    emotionalScore: { loneliness: 0, confusion: 0, distress: 0 }, 
                    sessionHistory: [] 
                }),
            }),
            {
                name: 'elderlink-storage',
            }
        )
    )
);
