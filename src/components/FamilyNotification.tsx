'use client';

import { motion } from 'framer-motion';
import { useElderLinkStore } from '@/store/useElderLinkStore';
import { useEffect } from 'react';

export const FamilyNotification = () => {
    const { userProfile, activeIntervention, clearIntervention } = useElderLinkStore();
    
    const familyMemberName = activeIntervention.params?.familyMember;
    const urgency = activeIntervention.params?.urgency || 'low';
    const message = activeIntervention.params?.message;

    const familyMember = userProfile.familyMembers.find(m => m.name === familyMemberName);

    useEffect(() => {
        const timer = setTimeout(() => {
            clearIntervention();
        }, 5000);

        return () => clearTimeout(timer);
    }, [clearIntervention]);

    const urgencyColors = {
        low: 'from-blue-100 to-blue-200',
        medium: 'from-orange-100 to-orange-200',
        high: 'from-purple-100 to-purple-200'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full h-full flex items-center justify-center"
        >
            <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={`bg-gradient-to-br ${urgencyColors[urgency as keyof typeof urgencyColors]} rounded-2xl p-8 w-full max-w-md text-center`}
            >
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-300 to-purple-300 rounded-full mb-6 flex items-center justify-center overflow-hidden"
                >
                    {familyMember?.photo ? (
                        <img src={familyMember.photo} alt={familyMember.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-6xl">{familyMember?.name[0] || '👤'}</span>
                    )}
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                    Contacting {familyMemberName}...
                </h2>

                {message && (
                    <p className="text-xl text-gray-700 mb-4">{message}</p>
                )}

                <div className="flex items-center justify-center gap-2 mb-3">
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                </div>

                <p className="text-lg text-gray-600">
                    {familyMember?.relation} will be notified
                </p>
            </motion.div>
        </motion.div>
    );
};
