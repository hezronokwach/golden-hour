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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full h-full flex items-center justify-center p-4"
        >
            <div className="bg-white rounded-2xl p-6 w-full h-full overflow-y-auto relative">
                <button
                    onClick={clearIntervention}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors z-10"
                >
                    <X size={24} />
                </button>

                <h2 className="text-3xl font-bold mb-6 text-gray-800 pr-12">
                    {familyMemberFilter && familyMemberFilter !== 'all' 
                        ? `Photos of ${familyMemberFilter}` 
                        : 'Your Family'}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    {displayMembers.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-100 rounded-xl p-4 text-center"
                        >
                            <div className="w-full aspect-square rounded-lg mb-3 overflow-hidden bg-gray-200">
                                <img 
                                    src={member.photo} 
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.parentElement!.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center"><span class="text-5xl">${member.name[0]}</span></div>`;
                                    }}
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-1">{member.name}</h3>
                            <p className="text-xl text-gray-600">{member.relation}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
