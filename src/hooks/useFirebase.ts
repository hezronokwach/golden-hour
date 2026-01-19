'use client';

import { useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useElderLinkStore } from '@/store/useElderLinkStore';

export const useFirebaseSync = () => {
    const emotionalScore = useElderLinkStore((state) => state.emotionalScore);
    const voiceState = useElderLinkStore((state) => state.voiceState);
    const activeIntervention = useElderLinkStore((state) => state.activeIntervention);
    const lastSaveRef = useRef<number>(0);

    useEffect(() => {
        const now = Date.now();
        if (now - lastSaveRef.current < 5000) return;

        const saveSession = async () => {
            try {
                if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;

                await addDoc(collection(db, "sessions"), {
                    emotionalScore,
                    voiceState,
                    activeIntervention: activeIntervention.type,
                    timestamp: serverTimestamp(),
                });
                lastSaveRef.current = now;
            } catch (e) {
                console.warn("Firebase sync failed (check config):", e);
            }
        };

        if (voiceState !== 'idle') {
            saveSession();
        }
    }, [emotionalScore, voiceState, activeIntervention.type]);
};
