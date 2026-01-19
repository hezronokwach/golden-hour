'use client';

import { CompanionOrb } from '@/components/CompanionOrb';
import { VoiceController } from '@/components/VoiceController';
import { StressChart } from '@/components/StressChart';
import { PhotoAlbum } from '@/components/PhotoAlbum';
import { MusicPlayer } from '@/components/MusicPlayer';
import { FamilyNotification } from '@/components/FamilyNotification';
import { CalmGuidance } from '@/components/CalmGuidance';
import { useFirebaseSync } from '@/hooks/useFirebase';
import { useElderLinkStore } from '@/store/useElderLinkStore';
import { AnimatePresence } from 'framer-motion';

export default function Home() {
  useFirebaseSync();
  const activeIntervention = useElderLinkStore((state) => state.activeIntervention);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800 flex flex-col">
      <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-blue-200 shadow-lg">
              <img src="/logo.png" alt="ElderLink Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-800">ElderLink</h1>
              <p className="text-base text-gray-500">Your Companion</p>
            </div>
          </div>
          <div className="text-2xl text-gray-600">
            {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-6 py-8 gap-8">
        <aside className="lg:w-96 flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center py-6">
            <CompanionOrb />
          </div>
          <VoiceController />
        </aside>

        <section className="flex-1 flex flex-col gap-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 min-h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeIntervention.type === 'none' ? (
                <div className="text-center">
                  <p className="text-3xl text-gray-500">Ready to help</p>
                </div>
              ) : (
                <>
                  {activeIntervention.type === 'photos' && <PhotoAlbum />}
                  {activeIntervention.type === 'music' && <MusicPlayer />}
                  {activeIntervention.type === 'family_alert' && <FamilyNotification />}
                  {activeIntervention.type === 'calm_guidance' && <CalmGuidance />}
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-gray-700 px-2">Emotional Trends</h2>
            <StressChart />
          </div>
        </section>
      </div>
    </main>
  );
}
