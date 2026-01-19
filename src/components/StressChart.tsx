'use client';

import { useElderLinkStore } from '@/store/useElderLinkStore';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { motion } from 'framer-motion';
import { useMemo, useEffect, useState } from 'react';

export const StressChart = () => {
    const sessionHistory = useElderLinkStore((state) => state.sessionHistory);
    const emotionalScore = useElderLinkStore((state) => state.emotionalScore);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const avgScore = useMemo(() => {
        return Math.round((emotionalScore.loneliness + emotionalScore.confusion + emotionalScore.distress) / 3);
    }, [emotionalScore]);

    if (!isMounted || sessionHistory.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center glass rounded-3xl border border-gray-200">
                <p className="text-lg text-gray-400">No session data yet. Start talking to see emotional trends.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-80 bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-gray-200 shadow-lg"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-700">Emotional Trends</h3>
                    <p className="text-sm text-gray-500">Real-time Session Analysis</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#5B9BD5' }} />
                        <span className="text-sm text-gray-600">Loneliness</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F4A460' }} />
                        <span className="text-sm text-gray-600">Confusion</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#9B7EBD' }} />
                        <span className="text-sm text-gray-600">Distress</span>
                    </div>
                </div>
            </div>

            <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sessionHistory}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                            minTickGap={30}
                        />
                        <YAxis
                            domain={[0, 100]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid #ddd',
                                borderRadius: '0.5rem',
                                fontSize: '14px'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="loneliness"
                            stroke="#5B9BD5"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="confusion"
                            stroke="#F4A460"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="distress"
                            stroke="#9B7EBD"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
