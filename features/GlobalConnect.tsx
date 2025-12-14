import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { encode, decode, decodeAudioData } from '../utils';
import { 
  PhoneIcon, 
  VideoCameraIcon, 
  BackspaceIcon, 
  SignalIcon, 
  GlobeAltIcon,
  LockClosedIcon,
} from '@heroicons/react/24/solid';

type CallStatus = 'idle' | 'connecting' | 'connected' | 'ended';

const GlobalConnect: React.FC = () => {
    const [targetIdentity, setTargetIdentity] = useState('');
    const [status, setStatus] = useState<CallStatus>('idle');
    const [isVideo, setIsVideo] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [connectionLog, setConnectionLog] = useState<string>('');

    // Audio/Video Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const frameIntervalRef = useRef<number | null>(null);
    
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    let nextStartTime = 0;

    // Timer logic
    useEffect(() => {
        let interval: any;
        if (status === 'connected') {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startCall = async (video: boolean) => {
        setIsVideo(video);
        setStatus('connecting');
        setConnectionLog("Establishing Secure WebRTC Uplink...");

        try {
            const constraints = { audio: true, video: video ? { width: 640, height: 360 } : false };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            if (video && videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            if (!apiKey) throw new Error("API Key not found");

            const ai = new GoogleGenAI({ apiKey: apiKey as string });

            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

            // Initialize Gemini Live Session
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO], 
                    systemInstruction: `
                        You are participating in a secure Voice/Video Uplink.
                        Identity Code: ${targetIdentity || 'General Channel'}.
                        Role: Act as a helpful operational assistant or the specific persona requested.
                        Language: Arabic (Primary) or English.
                        Be concise, professional, and aware that this is a real-time data stream.
                    `,
                },
                callbacks: {
                    onopen: () => {
                        setStatus('connected');
                        setConnectionLog("Uplink Active. Channel Secure.");
                        
                        if (audioContextRef.current) {
                            mediaStreamSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
                            scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
                            
                            scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                                const pcmBlob = {
                                    data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                    mimeType: 'audio/pcm;rate=16000',
                                };
                                if (sessionPromiseRef.current) {
                                    sessionPromiseRef.current.then(session => session.sendRealtimeInput({ media: pcmBlob }));
                                }
                            };
                            
                            mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
                            scriptProcessorRef.current.connect(audioContextRef.current.destination);
                        }

                        if (video && videoRef.current) {
                            const videoEl = videoRef.current;
                            const ctx = canvasRef.current.getContext('2d');
                            frameIntervalRef.current = window.setInterval(() => {
                                if (videoEl.videoWidth && ctx) {
                                    canvasRef.current.width = videoEl.videoWidth / 2;
                                    canvasRef.current.height = videoEl.videoHeight / 2;
                                    ctx.drawImage(videoEl, 0, 0, canvasRef.current.width, canvasRef.current.height);
                                    const base64Data = canvasRef.current.toDataURL('image/jpeg', 0.6).split(',')[1];
                                    if (sessionPromiseRef.current) {
                                        sessionPromiseRef.current.then(session => {
                                            session.sendRealtimeInput({ media: { mimeType: 'image/jpeg', data: base64Data } });
                                        });
                                    }
                                }
                            }, 1000);
                        }
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (audioData && outputAudioContextRef.current) {
                             const audioBuffer = await decodeAudioData(decode(audioData), outputAudioContextRef.current, 24000, 1);
                             const source = outputAudioContextRef.current.createBufferSource();
                             source.buffer = audioBuffer;
                             source.connect(outputAudioContextRef.current.destination);
                             const currentTime = outputAudioContextRef.current.currentTime;
                             const startTime = Math.max(currentTime, nextStartTime);
                             source.start(startTime);
                             nextStartTime = startTime + audioBuffer.duration;
                        }
                    },
                    onclose: () => endCall(),
                    onerror: (e) => {
                        console.error(e);
                        endCall();
                    }
                }
            });

        } catch (err) {
            console.error("Connection Error:", err);
            setConnectionLog("Connection Failed: Check API Key & Permissions.");
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    const endCall = useCallback(() => {
        setStatus('ended');
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }
        
        if (mediaStreamSourceRef.current && scriptProcessorRef.current) {
            mediaStreamSourceRef.current.disconnect();
            scriptProcessorRef.current.disconnect();
        }

        if (frameIntervalRef.current) {
            clearInterval(frameIntervalRef.current);
            frameIntervalRef.current = null;
        }

        if (audioContextRef.current?.state !== 'closed') audioContextRef.current?.close();
        if (outputAudioContextRef.current?.state !== 'closed') outputAudioContextRef.current?.close();
        
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }

        setTimeout(() => {
            setStatus('idle');
            setCallDuration(0);
            setTargetIdentity('');
            setConnectionLog('');
        }, 2000);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative overflow-hidden font-mono">
            {/* Background Matrix/Map Effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/40 via-black to-black"></div>
                 <div className="grid grid-cols-12 gap-2 h-full w-full opacity-10">
                    {Array.from({length: 48}).map((_,i) => (
                        <div key={i} className="border border-emerald-500/20"></div>
                    ))}
                 </div>
            </div>

            {/* MAIN INTERFACE */}
            <div className="z-10 w-full max-w-md bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col h-[600px]">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <SignalIcon className="w-5 h-5 text-emerald-400 animate-pulse" />
                        <span className="font-bold text-emerald-400 tracking-widest text-sm">AIRLINK V2.0</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <GlobeAltIcon className="w-4 h-4" />
                        <span>VOIP SECURE</span>
                    </div>
                </div>

                {/* CALL SCREEN (Connected) */}
                {status !== 'idle' ? (
                    <div className="flex-1 flex flex-col items-center relative">
                        {/* Video Layer */}
                        <div className={`absolute inset-0 z-0 ${isVideo ? 'block' : 'hidden'}`}>
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
                        </div>

                        <div className="z-10 flex-1 flex flex-col items-center justify-center space-y-8 w-full">
                            <div className="text-center">
                                <div className="w-24 h-24 rounded-full bg-gray-700 border-4 border-emerald-500 mx-auto mb-4 flex items-center justify-center animate-pulse relative">
                                    {isVideo ? <VideoCameraIcon className="w-12 h-12 text-white" /> : <GlobeAltIcon className="w-12 h-12 text-white" />}
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-1">{targetIdentity || "Secure Channel"}</h2>
                                <p className="text-emerald-400 text-sm animate-pulse">{status === 'connecting' ? 'Establishing Uplink...' : formatTime(callDuration)}</p>
                                <p className="text-xs text-gray-400 mt-2">{connectionLog}</p>
                            </div>
                        </div>

                        {/* End Call Button */}
                        <div className="z-10 p-8 w-full flex justify-center pb-8">
                            <button 
                                onClick={endCall}
                                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-lg shadow-red-900/50 transition-transform hover:scale-110"
                            >
                                <PhoneIcon className="w-8 h-8 text-white transform rotate-[135deg]" />
                            </button>
                        </div>
                    </div>
                ) : (
                    /* SETUP PAD (Idle) */
                    <div className="flex-1 flex flex-col p-8 justify-center space-y-6">
                        <div className="text-center space-y-2">
                            <span className="text-emerald-500 text-xs flex items-center justify-center gap-1 bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-500/30 w-fit mx-auto mb-4">
                                <LockClosedIcon className="w-3 h-3" /> قناة مشفرة (End-to-End)
                            </span>
                            <h2 className="text-xl font-bold text-white">اتصال فضائي (Gemini Live)</h2>
                            <p className="text-xs text-gray-400">تحدث مباشرة مع الذكاء الاصطناعي عبر بروتوكول WebRTC</p>
                        </div>

                        <input 
                            type="text" 
                            placeholder="اسم المعرف (اختياري)" 
                            value={targetIdentity}
                            onChange={(e) => setTargetIdentity(e.target.value)}
                            className="bg-gray-800 border border-gray-600 p-3 rounded-xl text-center text-white focus:border-emerald-500 outline-none"
                        />

                        {/* Call Actions */}
                        <div className="flex justify-center gap-6 mt-8">
                            <button 
                                onClick={() => startCall(false)}
                                className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center shadow-lg shadow-green-900/50 transition-transform hover:scale-110"
                            >
                                <PhoneIcon className="w-8 h-8 text-white" />
                            </button>
                             <button 
                                onClick={() => startCall(true)}
                                className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-900/50 transition-transform hover:scale-110"
                            >
                                <VideoCameraIcon className="w-8 h-8 text-white" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalConnect;