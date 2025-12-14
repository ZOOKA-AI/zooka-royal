import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { encode, decode, decodeAudioData } from '../utils';
import { MicrophoneIcon, StopCircleIcon, SpeakerWaveIcon, PlayIcon } from '@heroicons/react/24/solid';

type Mode = "voice-chat" | "transcribe" | "tts";

// Voice Chat Component
const VoiceChat: React.FC = () => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [userTranscript, setUserTranscript] = useState('');
    const [modelTranscript, setModelTranscript] = useState('');
    const [history, setHistory] = useState<{user: string, model: string}[]>([]);
    
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    let nextStartTime = 0;

    const stopConversation = useCallback(() => {
        setIsActive(false);
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }
        if (mediaStreamSourceRef.current && scriptProcessorRef.current) {
            mediaStreamSourceRef.current.disconnect();
            scriptProcessorRef.current.disconnect();
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
             audioContextRef.current.close();
        }
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            outputAudioContextRef.current.close();
        }
    }, []);

    const startConversation = useCallback(async () => {
        setIsConnecting(true);
        setUserTranscript('');
        setModelTranscript('');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            const ai = new GoogleGenAI({ apiKey: apiKey as string });

            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
                callbacks: {
                    onopen: () => {
                        setIsConnecting(false);
                        setIsActive(true);
                        
                        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
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
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            setUserTranscript(prev => prev + message.serverContent.inputTranscription.text);
                        }
                        if (message.serverContent?.outputTranscription) {
                            setModelTranscript(prev => prev + message.serverContent.outputTranscription.text);
                        }
                        if (message.serverContent?.turnComplete) {
                            setHistory(prev => [...prev, {user: userTranscript, model: modelTranscript}]);
                            setUserTranscript('');
                            setModelTranscript('');
                        }

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
                    onerror: (e) => {
                        console.error('Live API Error:', e);
                        setIsConnecting(false);
                        stopConversation();
                    },
                    onclose: () => {
                       stopConversation();
                    },
                },
            });

        } catch (error) {
            console.error("Failed to start conversation:", error);
            setIsConnecting(false);
        }
    }, [userTranscript, modelTranscript, stopConversation]);


    return (
        <div>
            <div className="flex justify-center mb-4">
                 <button 
                    onClick={isActive ? stopConversation : startConversation}
                    disabled={isConnecting}
                    className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 disabled:bg-gray-600 transition-colors flex items-center space-x-2 space-x-reverse"
                >
                    {isConnecting ? <LoadingSpinner/> : (isActive ? <StopCircleIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />)}
                    <span>{isConnecting ? "جاري الاتصال..." : (isActive ? "إنهاء المحادثة" : "بدء المحادثة")}</span>
                </button>
            </div>
             {isActive && (
                <div className="text-center p-4 rounded-lg bg-gray-900 animate-pulse">
                    <p className="text-purple-400">جاري الاستماع...</p>
                </div>
            )}
             <div className="mt-4 space-y-4">
                <div className="bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-400 mb-2">أنت قلت:</h4>
                    <p className="text-gray-200 min-h-[2rem]">{userTranscript}</p>
                </div>
                 <div className="bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-400 mb-2">Gemini قال:</h4>
                    <p className="text-gray-200 min-h-[2rem]">{modelTranscript}</p>
                </div>
                 <div className="border-t border-gray-700 pt-4">
                      <h3 className="text-lg font-bold mb-2">السجل</h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {history.slice().reverse().map((turn, index) => (
                            <div key={index} className="p-2 bg-gray-700 rounded-md">
                                <p><b>أنت:</b> {turn.user}</p>
                                <p><b>Gemini:</b> {turn.model}</p>
                            </div>
                        ))}
                      </div>
                 </div>
            </div>
        </div>
    );
};

// Transcribe Component
const Transcribe: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [loading, setLoading] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<globalThis.Blob[]>([]);

    const handleStartRecording = async () => {
        setTranscript('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = async () => {
                setLoading(true);
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                audioChunksRef.current = [];
                
                const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
                const ai = new GoogleGenAI({ apiKey: apiKey as string });
                const base64Audio = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(audioBlob);
                });

                const result = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: [
                        { parts: [{ inlineData: { mimeType: 'audio/webm', data: base64Audio } }] },
                        { parts: [{ text: "Transcribe this audio." }] }
                    ]
                });
                setTranscript(result.text ?? "لم أتمكن من نسخ الصوت.");
                setLoading(false);
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div>
            <button onClick={isRecording ? handleStopRecording : handleStartRecording} className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 space-x-reverse">
                {isRecording ? <><StopCircleIcon className="w-6 h-6" /><span>إيقاف التسجيل</span></> : <><MicrophoneIcon className="w-6 h-6" /><span>بدء التسجيل</span></>}
            </button>
            <div className="mt-4 p-4 bg-gray-900 rounded-lg min-h-[100px]">
                <h3 className="text-lg font-semibold mb-2">النص المنسوخ</h3>
                {loading ? <LoadingSpinner /> : <p className="whitespace-pre-wrap">{transcript}</p>}
            </div>
        </div>
    );
};

// Text-to-Speech Component
const TTS: React.FC = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Initialize AudioContext on component mount
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        return () => {
            // Clean up AudioContext on component unmount
            audioContextRef.current?.close();
        };
    }, []);

    const handleGenerateSpeech = async () => {
        if (!text.trim() || !audioContextRef.current) return;
        setLoading(true);
        setAudioBuffer(null);
        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            const ai = new GoogleGenAI({ apiKey: apiKey as string });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                    },
                },
            });
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
                const buffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
                setAudioBuffer(buffer);
            }
        } catch (error) {
            console.error("Error generating speech:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaySpeech = () => {
        if (!audioBuffer || !audioContextRef.current) return;
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start();
    };

    return (
        <div className="space-y-4">
            <textarea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="أدخل النص هنا لتحويله إلى كلام..."
                className="w-full p-2 bg-gray-700 rounded-md border border-gray-600"
            />
            <button onClick={handleGenerateSpeech} disabled={loading || !text.trim()} className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg disabled:bg-gray-600 hover:bg-purple-700 flex items-center justify-center space-x-2 space-x-reverse">
                {loading ? <LoadingSpinner /> : <><SpeakerWaveIcon className="w-6 h-6" /><span>توليد الكلام</span></>}
            </button>
            {audioBuffer && (
                <div className="mt-4">
                     <button onClick={handlePlaySpeech} className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 space-x-reverse">
                         <PlayIcon className="w-6 h-6" /> <span>تشغيل الصوت</span>
                      </button>
                </div>
            )}
        </div>
    );
};


const AudioSuite: React.FC = () => {
    const [mode, setMode] = useState<Mode>('voice-chat');

    const renderContent = () => {
        switch (mode) {
            case 'voice-chat':
                return <VoiceChat />;
            case 'transcribe':
                return <Transcribe />;
            case 'tts':
                return <TTS />;
            default:
                return null;
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-4 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">استوديو الصوت</h2>
            <div className="flex border-b border-gray-700 mb-4">
                <button onClick={() => setMode('voice-chat')} className={`px-4 py-2 ${mode === 'voice-chat' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400'}`}>محادثة صوتية</button>
                <button onClick={() => setMode('transcribe')} className={`px-4 py-2 ${mode === 'transcribe' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400'}`}>النسخ الصوتي</button>
                <button onClick={() => setMode('tts')} className={`px-4 py-2 ${mode === 'tts' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400'}`}>نص إلى كلام</button>
            </div>
            {renderContent()}
        </div>
    );
};

export default AudioSuite;