
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { blobToBase64 } from '../utils';
import { 
  BuildingOffice2Icon, 
  VideoCameraIcon, 
  CubeTransparentIcon, 
  ClipboardDocumentCheckIcon, 
  PaintBrushIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid';

type Mode = 'scan' | 'inspect' | 'renovate';

interface AnalysisResult {
    report: string;
    hazards?: string[];
    specs?: string[];
    blueprintSvg?: string;
}

const VisionArchitect: React.FC = () => {
    const [mode, setMode] = useState<Mode>('scan');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(f);
            setResult(null);
        }
    };

    const processVideo = async () => {
        if (!file) return;
        setLoading(true);
        setResult(null);

        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            const ai = new GoogleGenAI({ apiKey: apiKey as string });
            
            const base64Data = await blobToBase64(file);
            
            let prompt = "";
            let model = "gemini-2.5-flash"; 

            if (mode === 'scan') {
                prompt = `
                    Act as a Senior Architect and 3D Surveyor.
                    Analyze this video/image of a construction site or room.
                    
                    Task:
                    1. Estimate the dimensions (Height, Width, Depth).
                    2. Describe the layout in detail.
                    3. Generate a simple SVG code string that represents the Floor Plan (Top-down view) of this space. 
                       - Use <svg> tags.
                       - Draw simple rectangles/lines for walls.
                       - Keep it abstract but representative.
                    
                    Output JSON:
                    {
                        "report": "Detailed description of the space...",
                        "specs": ["Area: approx 20sqm", "Ceiling: 3m", "Material: Concrete"],
                        "blueprintSvg": "<svg ...>...</svg>"
                    }
                `;
            } else if (mode === 'inspect') {
                prompt = `
                    Act as a Safety & Structural Engineer (Civil Engineering).
                    Analyze this video for:
                    1. Structural defects (cracks, leaks).
                    2. Wiring or plumbing issues.
                    3. Safety hazards (debris, missing rails).
                    4. Progress percentage estimate.

                    Output JSON:
                    {
                        "report": "Engineering Inspection Report...",
                        "hazards": ["Crack detected in North wall", "Exposed wiring"],
                        "specs": ["Progress: 65%", "Quality: Grade B"]
                    }
                `;
            } else if (mode === 'renovate') {
                 model = "gemini-3-pro-preview";
                 prompt = `
                    Act as an Interior Designer.
                    Analyze this unfinished space.
                    1. Suggest a design style (Modern, Classic, Industrial).
                    2. Describe how to finish the walls, floor, and lighting.
                    3. Provide a vision of the final look.

                    Output JSON:
                    {
                        "report": "Design Proposal...",
                        "specs": ["Style: Modern Industrial", "Color: Grey & Wood"],
                        "blueprintSvg": "" 
                    }
                 `;
            }

            const result = await ai.models.generateContent({
                model: model,
                contents: {
                    parts: [
                        { inlineData: { mimeType: file.type, data: base64Data } },
                        { text: prompt }
                    ]
                },
                config: { responseMimeType: "application/json" }
            });

            const data = JSON.parse(result.text || '{}');
            setResult(data);

        } catch (error) {
            console.error(error);
            alert("حدث خطأ أثناء المعالجة. تأكد من إعدادات API.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 bg-gray-900 min-h-screen text-white">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-700 pb-6">
                <div className="p-4 bg-orange-600 rounded-2xl shadow-lg shadow-orange-900/50">
                    <BuildingOffice2Icon className="w-10 h-10 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">المهندس المعماري (Vision Architect)</h1>
                    <p className="text-gray-400">حول كاميرا هاتفك إلى ماسح ضوئي ثلاثي الأبعاد ومهندس مشرف.</p>
                </div>
            </div>

            {/* Modes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button 
                    onClick={() => setMode('scan')}
                    className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                        mode === 'scan' ? 'border-orange-500 bg-orange-900/20' : 'border-gray-700 bg-gray-800 hover:bg-gray-750'
                    }`}
                >
                    <CubeTransparentIcon className="w-8 h-8 text-orange-400" />
                    <span className="font-bold">مسح وبناء (3D Scan)</span>
                    <span className="text-xs text-gray-400">تحويل الفيديو لمخطط هندسي</span>
                </button>
                <button 
                    onClick={() => setMode('inspect')}
                    className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                        mode === 'inspect' ? 'border-red-500 bg-red-900/20' : 'border-gray-700 bg-gray-800 hover:bg-gray-750'
                    }`}
                >
                    <ClipboardDocumentCheckIcon className="w-8 h-8 text-red-400" />
                    <span className="font-bold">فحص هندسي (Safety)</span>
                    <span className="text-xs text-gray-400">كشف العيوب والمخاطر</span>
                </button>
                <button 
                    onClick={() => setMode('renovate')}
                    className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                        mode === 'renovate' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 bg-gray-800 hover:bg-gray-750'
                    }`}
                >
                    <PaintBrushIcon className="w-8 h-8 text-blue-400" />
                    <span className="font-bold">تخيل التشطيب (Decor)</span>
                    <span className="text-xs text-gray-400">رؤية المستقبل للمكان</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 text-center">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileSelect} 
                            accept="video/*,image/*" 
                            className="hidden" 
                        />
                        
                        {!preview ? (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-600 rounded-xl p-10 cursor-pointer hover:border-orange-500 transition-colors"
                            >
                                <VideoCameraIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <h3 className="text-lg font-bold">ارفع فيديو للموقع</h3>
                                <p className="text-sm text-gray-400 mt-2">قم بالتمشية في الموقع ببطء (Walkthrough)</p>
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border border-gray-600">
                                {file?.type.startsWith('video') ? (
                                    <video src={preview} controls preload="metadata" className="w-full h-64 object-cover" />
                                ) : (
                                    <img src={preview} alt="preview" loading="lazy" className="w-full h-64 object-cover" />
                                )}
                                <button 
                                    onClick={() => {setFile(null); setPreview(null); setResult(null);}}
                                    className="absolute top-2 right-2 bg-red-600 p-1 rounded-full text-white"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        <button 
                            onClick={processVideo}
                            disabled={!file || loading}
                            className={`w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 ${
                                !file ? 'bg-gray-700 text-gray-500 cursor-not-allowed' :
                                loading ? 'bg-orange-800 text-white cursor-wait' :
                                'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/40'
                            }`}
                        >
                            {loading ? <LoadingSpinner /> : <><EyeIcon className="w-6 h-6" /> {mode === 'scan' ? 'بدء المسح الهندسي' : 'بدء التحليل'}</>}
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-7">
                    {!result ? (
                        <div className="h-full bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center text-gray-500 min-h-[500px]">
                            <CubeTransparentIcon className="w-24 h-24 opacity-20 mb-4" />
                            <p className="text-xl">المخطط الهندسي والتقرير سيظهر هنا</p>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in-up">
                            
                            {/* Blueprint View (Scan Mode) */}
                            {mode === 'scan' && result.blueprintSvg && (
                                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <CubeTransparentIcon className="w-6 h-6 text-blue-400" />
                                        المخطط الهندسي (AI Generated Blueprint)
                                    </h3>
                                    <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30 flex justify-center">
                                        {/* Render SVG safely */}
                                        <div dangerouslySetInnerHTML={{ __html: result.blueprintSvg.replace('<svg', '<svg width="100%" height="300px"') }} />
                                    </div>
                                    <p className="text-xs text-center text-gray-500 mt-2">* مخطط تقريبي تم توليده بواسطة الذكاء الاصطناعي بناءً على الفيديو.</p>
                                </div>
                            )}

                            {/* Report Card */}
                            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                                <h3 className="text-xl font-bold text-white mb-4">
                                    {mode === 'scan' ? 'تقرير المساحة' : mode === 'inspect' ? 'تقرير الفحص الهندسي' : 'مقترح التصميم'}
                                </h3>
                                <div className="prose prose-invert max-w-none text-gray-300">
                                    <p className="whitespace-pre-wrap">{result.report}</p>
                                </div>
                            </div>

                            {/* Hazards / Specs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.specs && (
                                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                                        <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                                            <CheckCircleIcon className="w-5 h-5" /> المواصفات المكتشفة
                                        </h4>
                                        <ul className="space-y-2">
                                            {result.specs.map((s, i) => (
                                                <li key={i} className="text-sm text-gray-300 bg-gray-900 p-2 rounded border-r-2 border-green-500">
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {result.hazards && result.hazards.length > 0 && (
                                    <div className="bg-red-900/20 p-4 rounded-xl border border-red-700/50">
                                        <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                                            <ExclamationTriangleIcon className="w-5 h-5" /> تنبيهات السلامة
                                        </h4>
                                        <ul className="space-y-2">
                                            {result.hazards.map((h, i) => (
                                                <li key={i} className="text-sm text-white bg-red-900/50 p-2 rounded flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-red-500"></span> {h}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <button className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                <ArrowUpTrayIcon className="w-5 h-5" /> تصدير التقرير (PDF)
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisionArchitect;
