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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-8"
        >
            <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={`bg-gradient-to-br ${urgencyColors[urgency as keyof typeof urgencyColors]} rounded-3xl p-12 max-w-xl w-full text-center shadow-2xl`}
            >
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-40 h-40 mx-auto bg-gradient-to-br from-blue-300 to-purple-300 rounded-full mb-8 flex items-center justify-center"
                >
                    <span className="text-7xl">{familyMember?.name[0] || '👤'}</span>
                </motion.div>

                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    Contacting {familyMemberName}...
                </h2>

                {message && (
                    <p className="text-2xl text-gray-700 mb-6">{message}</p>
                )}

                <div className="flex items-center justify-center gap-2 mb-4">
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-3 h-3 bg-blue-500 rounded-full"
                    />
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        className="w-3 h-3 bg-blue-500 rounded-full"
                    />
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                        className="w-3 h-3 bg-blue-500 rounded-full"
                    />
                </div>

                <p className="text-xl text-gray-600">
                    {familyMember?.relation} will be notified
                </p>
            </motion.div>
        </motion.div>
    );
};
