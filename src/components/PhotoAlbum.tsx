'use client';

import { motion } from 'framer-motion';
import { useElderLinkStore } from '@/store/useElderLinkStore';
import { X } from 'lucide-react';

export const PhotoAlbum = () => {
    const { userProfile, activeIntervention, clearIntervention } = useElderLinkStore();
    const familyMemberFilter = activeIntervention.params?.familyMember;

    const displayMembers = familyMemberFilter && familyMemberFilter !== 'all'
        ? userProfile.familyMembers.filter(m => m.name === familyMemberFilter)
        : userProfile.familyMembers;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8"
        >
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                <button
                    onClick={clearIntervention}
                    className="absolute top-6 right-6 w-14 h-14 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                    <X size={32} />
                </button>

                <h2 className="text-4xl font-bold mb-8 text-gray-800">
                    {familyMemberFilter && familyMemberFilter !== 'all' 
                        ? `Photos of ${familyMemberFilter}` 
                        : 'Your Family'}
                </h2>

                <div className="grid grid-cols-2 gap-6">
                    {displayMembers.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-100 rounded-2xl p-6 text-center"
                        >
                            <div className="w-full aspect-square rounded-xl mb-4 overflow-hidden bg-gray-200">
                                <img 
                                    src={member.photo} 
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.parentElement!.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center"><span class="text-6xl">${member.name[0]}</span></div>`;
                                    }}
                                />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-2">{member.name}</h3>
                            <p className="text-2xl text-gray-600">{member.relation}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
