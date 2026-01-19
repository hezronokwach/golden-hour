import { useState, useRef, useEffect, useCallback } from 'react';
import { HumeClient } from 'hume';
import { useElderLinkStore } from '@/store/useElderLinkStore';

import {
    convertBlobToBase64,
    ensureSingleValidAudioTrack,
    getAudioStream,
    getBrowserSupportedMimeType,
    EVIWebAudioPlayer,
    MimeType
} from 'hume';

export type HumeStatus = 'IDLE' | 'CONNECTING' | 'ACTIVE' | 'ERROR';

export interface HumeMessage {
    role: 'user' | 'assistant';
    text: string;
    timestamp?: number;
}

export const useHume = () => {
    const { setEmotionalScores, setVoiceState } = useElderLinkStore();
    const [status, setStatus] = useState<HumeStatus>('IDLE');
    const [messages, setMessages] = useState<HumeMessage[]>([]);
    const [liveTranscript, setLiveTranscript] = useState<string>('');
    const [isMicMuted, setIsMicMuted] = useState(true);
    const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
    const isSpeakerMutedRef = useRef(false);
    const [error, setError] = useState<string | null>(null);
    const [emotions, setEmotions] = useState<Record<string, number>>({});

    const socketRef = useRef<any>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const playerRef = useRef<EVIWebAudioPlayer | null>(null);

    useEffect(() => {
        return () => {
            if (recorderRef.current) {
                recorderRef.current.stream.getTracks().forEach(t => t.stop());
            }
            if (playerRef.current) {
                playerRef.current.dispose();
            }
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const calculateEmotionalState = (prosody: any) => {
        if (!prosody?.scores) return { loneliness: 0, confusion: 0, distress: 0 };

        const lonelinessWeights: Record<string, number> = {
            'sadness': 2.5,
            'loneliness': 3.0,
            'sorrow': 2.0,
            'disappointment': 1.5,
            'boredom': 1.8,
            'contentment': -1.5,
            'joy': -2.0
        };

        const confusionWeights: Record<string, number> = {
            'confusion': 3.0,
            'uncertainty': 2.5,
            'anxiety': 2.0,
            'fear': 1.8,
            'surprise': 1.2,
            'calmness': -1.5
        };

        const distressWeights: Record<string, number> = {
            'distress': 3.0,
            'anxiety': 2.5,
            'fear': 2.5,
            'pain': 2.8,
            'anger': 2.0,
            'relief': -2.0,
            'calmness': -1.8
        };

        const calculateScore = (weights: Record<string, number>) => {
            let sum = 0;
            Object.entries(prosody.scores).forEach(([emotion, score]: [string, any]) => {
                const weight = weights[emotion.toLowerCase()] || 0;
                sum += score * weight;
            });
            return Math.max(0, Math.min(100, Math.round(sum * 300)));
        };

        const loneliness = calculateScore(lonelinessWeights);
        const confusion = calculateScore(confusionWeights);
        const distress = calculateScore(distressWeights);

        console.log(`Emotional State - Loneliness: ${loneliness}, Confusion: ${confusion}, Distress: ${distress}`);

        return { loneliness, confusion, distress };
    };

    const startAudioCapture = useCallback(async (socket: any) => {
        try {
            const mimeTypeResult = getBrowserSupportedMimeType();
            const mimeType = mimeTypeResult.success ? mimeTypeResult.mimeType : MimeType.WEBM;

            const micAudioStream = await getAudioStream();
            ensureSingleValidAudioTrack(micAudioStream);

            const recorder = new MediaRecorder(micAudioStream, { mimeType });

            recorder.ondataavailable = async (e: BlobEvent) => {
                if (e.data.size > 0 && socket.readyState === WebSocket.OPEN) {
                    const data = await convertBlobToBase64(e.data);
                    socket.sendAudioInput({ data });
                }
            };

            recorder.onerror = (e) => {
                console.error('MediaRecorder error:', e);
                setError('Microphone error');
            };

            recorder.start(80);
            recorderRef.current = recorder;
            setIsMicMuted(false);
            setVoiceState('listening');

            console.log('Audio capture started');
        } catch (err: any) {
            console.error('Failed to start audio capture:', err);
            setError(err.message);
        }
    }, [setVoiceState]);

    const stopAudioCapture = useCallback(() => {
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
            recorderRef.current.stop();
            recorderRef.current.stream.getTracks().forEach(t => t.stop());
            recorderRef.current = null;
            setIsMicMuted(true);
            setVoiceState('idle');
            console.log('Audio capture stopped');
        }
    }, [setVoiceState]);

    const handleOpen = useCallback(async () => {
        console.log('Hume socket opened');
        setStatus('ACTIVE');

        const player = new EVIWebAudioPlayer();
        await player.init();
        playerRef.current = player;
    }, []);

    const handleMessage = useCallback(async (msg: any) => {
        console.log('Hume message:', msg.type);

        switch (msg.type) {
            case 'audio_output':
                if (playerRef.current && !isSpeakerMutedRef.current) {
                    await playerRef.current.enqueue(msg);
                }
                break;

            case 'user_message':
                if (msg.message?.content) {
                    if (msg.interim) {
                        setLiveTranscript(msg.message.content);
                    } else {
                        setLiveTranscript('');
                        setMessages(prev => [...prev, {
                            role: 'user',
                            text: msg.message.content,
                            timestamp: Date.now()
                        }]);

                        // Calculate Emotional State from User Message
                        if (msg.models?.prosody) {
                            const scores = calculateEmotionalState(msg.models.prosody);
                            console.log('Calculated emotional scores:', scores);
                            setEmotionalScores(scores.loneliness, scores.confusion, scores.distress);
                            setEmotions(msg.models.prosody.scores || {});
                        }
                    }
                }
                break;

            case 'assistant_message':
                if (msg.message?.content) {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        text: msg.message.content,
                        timestamp: Date.now()
                    }]);
                    setVoiceState('speaking');
                }
                break;

            case 'assistant_end':
                setVoiceState('listening');
                break;

            case 'user_interruption':
                console.log('User interrupted');
                if (playerRef.current) {
                    playerRef.current.stop();
                }
                setVoiceState('listening');
                break;

            case 'tool_call':
                const toolName = msg.name;
                const toolCallId = msg.toolCallId || msg.tool_call_id;
                const toolParams = msg.parameters;

                console.warn('[ELDERLINK TOOL]', toolName, toolParams);

                let params: any = {};
                try {
                    params = typeof toolParams === 'string' ? JSON.parse(toolParams) : toolParams;
                } catch (e) {
                    console.error('Failed to parse tool parameters', e);
                }

                let result = { success: false, message: '' };

                if (toolName === 'show_photo_album') {
                    const familyMember = params.family_member || 'all';
                    useElderLinkStore.getState().triggerIntervention('photos', { familyMember });
                    result = { success: true, message: `Showing photos of ${familyMember}` };
                }
                else if (toolName === 'play_music') {
                    const preference = params.song_preference || 'favorite';
                    useElderLinkStore.getState().triggerIntervention('music', { preference });
                    result = { success: true, message: `Playing ${preference} music` };
                }
                else if (toolName === 'notify_family') {
                    const { family_member, urgency, message } = params;
                    useElderLinkStore.getState().triggerIntervention('family_alert', {
                        familyMember: family_member,
                        urgency,
                        message
                    });
                    result = { success: true, message: `Notified ${family_member}` };
                }
                else if (toolName === 'provide_orientation') {
                    const context = params.context_needed;
                    useElderLinkStore.getState().triggerIntervention('calm_guidance', { context });
                    result = { success: true, message: `Providing ${context} information` };
                }
                else if (toolName === 'start_calm_activity') {
                    const activity = params.activity_type;
                    useElderLinkStore.getState().triggerIntervention('calm_activity', { activity });
                    result = { success: true, message: `Starting ${activity} activity` };
                }

                if (socketRef.current?.sendToolResponseMessage) {
                    socketRef.current.sendToolResponseMessage({
                        type: 'tool_response',
                        toolCallId: toolCallId,
                        content: result.message
                    });
                }
                break;

            case 'error':
                console.error('Hume message error:', msg.message);
                setError(msg.message);
                break;

            default:
                console.log('DEBUG: Received message of type:', msg.type, msg);
                break;
        }
    }, [setEmotionalScores, setVoiceState]);

    const handleError = useCallback((err: Event | Error) => {
        console.error('Hume socket error:', err);
        setError('Connection error');
        setStatus('ERROR');
    }, []);

    const handleClose = useCallback((e: any) => {
        console.log('Hume socket closed:', e);
        setStatus('IDLE');
        setVoiceState('idle');

        if (recorderRef.current) {
            recorderRef.current.stream.getTracks().forEach(t => t.stop());
            recorderRef.current = null;
        }
        if (playerRef.current) {
            playerRef.current.dispose();
            playerRef.current = null;
        }
    }, [setVoiceState]);

    const startSession = useCallback(async (options?: { configId?: string; voiceId?: string; language?: string }) => {
        try {
            if (socketRef.current) {
                console.log('Session already active');
                return;
            }

            setStatus('CONNECTING');
            setError(null);

            const apiKey = process.env.NEXT_PUBLIC_HUME_API_KEY;
            if (!apiKey) {
                throw new Error('HUME_API_KEY not found in environment variables');
            }

            const client = new HumeClient({ apiKey });
            const configId = options?.configId || process.env.NEXT_PUBLIC_HUME_CONFIG_ID;

            const connectOptions: any = {};
            if (configId) connectOptions.configId = configId;

            const sessionSettings: any = {};
            if (options?.voiceId) sessionSettings.voiceId = options.voiceId;

            if (Object.keys(sessionSettings).length > 0) {
                connectOptions.sessionSettings = sessionSettings;
            }

            const socket = await client.empathicVoice.chat.connect(connectOptions);
            socketRef.current = socket;

            socket.on('open', handleOpen);
            socket.on('message', handleMessage);
            socket.on('error', handleError);
            socket.on('close', handleClose);

        } catch (err: any) {
            console.error('Failed to start Hume session:', err);
            setError(err.message);
            setStatus('ERROR');
        }
    }, [handleOpen, handleMessage, handleError, handleClose]);

    const endSession = useCallback(async () => {
        stopAudioCapture();

        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }

        setStatus('IDLE');
        setMessages([]);
    }, [stopAudioCapture]);

    const updateSessionSettings = useCallback((settings: { voiceId?: string; systemPrompt?: string; context?: string }) => {
        if (socketRef.current) {
            socketRef.current.sendSessionSettings(settings);
            console.log('Session settings updated:', settings);
        }
    }, []);

    const toggleMic = useCallback(async () => {
        if (!socketRef.current) {
            console.log('No active session');
            return;
        }

        if (isMicMuted) {
            await startAudioCapture(socketRef.current);
        } else {
            stopAudioCapture();
        }
    }, [isMicMuted, startAudioCapture, stopAudioCapture]);

    const toggleSpeaker = useCallback(() => {
        const newValue = !isSpeakerMutedRef.current;
        isSpeakerMutedRef.current = newValue;
        setIsSpeakerMuted(newValue);
        if (playerRef.current && newValue) {
            playerRef.current.stop();
        }
    }, []);

    return {
        status,
        messages,
        liveTranscript,
        isMicMuted,
        isSpeakerMuted,
        error,
        startSession,
        endSession,
        toggleMic,
        toggleSpeaker,
        updateSessionSettings,
        emotions
    };
};
