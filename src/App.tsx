/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Heart, 
  BookOpen, 
  Share2, 
  BarChart3, 
  Home as HomeIcon, 
  ChevronRight, 
  Upload,
  RefreshCw,
  Quote,
  Calendar as CalendarIcon,
  ArrowLeft,
  QrCode,
  Droplets
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { QRCodeSVG } from 'qrcode.react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { GardenEntry, AppStep, PlantEmotion, UserProfile, AppTheme } from './types';
import { EMOTION_EMOJIS, EMOTION_COLORS, MOCK_CAROUSEL_DATA, SHOP_ITEMS, SAMPLE_DATA, STRAWBERRY_CHARACTER } from './constants';
import { analyzePlant, reflectMood } from './services/gemini';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [step, setStep] = useState<AppStep>('login');
  const [history, setHistory] = useState<GardenEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<GardenEntry>>({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    name: '사용자1',
    coins: 10,
    purchasedThemes: [],
    currentTheme: 'default',
    purchasedAccessories: [],
    currentAccessory: null
  });

  // Load data from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem('emotion_garden_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedUser = localStorage.getItem('emotion_garden_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setStep('home'); // Skip login if user exists
    }
  }, []);

  // Save data to local storage
  useEffect(() => {
    localStorage.setItem('emotion_garden_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('emotion_garden_user', JSON.stringify(user));
  }, [user]);

  const saveEntry = (entry: GardenEntry) => {
    // Calculate average score
    const avg = Math.round((entry.emotionUnderstanding + entry.nutritionImprovementRate + entry.growthIndex) / 3);
    const finalEntry = { ...entry, averageScore: avg };

    // Award coins based on emotion understanding
    let earnedCoins = 1;
    if (finalEntry.emotionUnderstanding >= 80) earnedCoins = 5;
    else if (finalEntry.emotionUnderstanding >= 60) earnedCoins = 3;

    setUser(prev => ({ ...prev, coins: prev.coins + earnedCoins }));
    setHistory(prev => [finalEntry, ...prev]);
    setStep('home');
    alert(`${earnedCoins}코인이 지급되었습니다!`);
  };

  const navigateTo = (newStep: AppStep) => {
    setStep(newStep);
    window.scrollTo(0, 0);
  };

  const handleSampleExperience = () => {
    setCurrentEntry({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      photoUrl: SAMPLE_DATA.photoUrl,
      plantState: "싱싱함",
      plantEmotion: "happy",
      userMood: SAMPLE_DATA.mood,
      moodScore: SAMPLE_DATA.score,
      emotionUnderstanding: 85,
      understandingReason: "자신의 감정을 매우 구체적이고 솔직하게 표현하셨네요!",
      nutritionRecommendation: "비타민 C",
      nutritionImprovementRate: 90,
      growthIndex: 15,
      aiReflection: "새로운 시작에 대한 설렘이 가득하시네요. 딸기가 자라듯 당신의 마음도 자라날 거예요.",
      aiSummary: "생명을 돌보는 마음은 곧 나를 사랑하는 마음입니다.",
      recipe: "설렘 가득 딸기 요거트 스무디"
    });
    navigateTo('step2');
  };

  return (
    <div className={cn(
      "content-container",
      user.currentTheme !== 'default' && `theme-${user.currentTheme}`
    )}>
      {/* Background Decoration - Only visible on default theme */}
      {user.currentTheme === 'default' && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 z-0">
          <div className="absolute top-10 left-10 text-6xl">🍓</div>
          <div className="absolute bottom-20 right-10 text-6xl">🌿</div>
          <div className="absolute top-1/2 left-1/4 text-4xl">🌱</div>
        </div>
      )}

      {/* Header */}
      {step !== 'login' && (
        <header className={cn(
          "p-6 flex flex-col gap-4 z-10 bg-white/80 backdrop-blur-md sticky top-0 border-b border-pink-100",
          user.currentTheme === 'starry' && "bg-slate-900/80 border-slate-800"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')}>
              <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white shadow-md">
                <Heart size={24} fill="currentColor" />
              </div>
              <div>
                <h1 className={cn("text-xl font-bold text-pink-800 tracking-tight", user.currentTheme === 'starry' && "text-white")}>나의 감정 정원</h1>
                <p className="text-[10px] opacity-60">보유 코인: {user.coins}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => navigateTo('shop')}
                className="p-2 text-amber-500 hover:bg-amber-50 rounded-full transition-colors"
                title="정원 꾸미기"
              >
                <QrCode size={24} />
              </button>
              <button 
                onClick={() => navigateTo('portfolio')}
                className="p-2 text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
              >
                <BarChart3 size={24} />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 z-10 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          {step === 'login' && (
            <LoginView 
              key="login" 
              user={user} 
              onLogin={(name) => {
                setUser(prev => ({ ...prev, name }));
                setStep('home');
              }} 
            />
          )}
          {step === 'home' && (
            <HomeView 
              key="home" 
              user={user}
              navigateTo={navigateTo} 
              history={history} 
              onSample={handleSampleExperience}
            />
          )}
          {step === 'step1' && (
            <Step1Photo 
              key="step1" 
              onNext={(photo) => {
                setCurrentEntry({ ...currentEntry, photoUrl: photo, id: Date.now().toString(), date: new Date().toISOString() });
                navigateTo('step2');
              }} 
            />
          )}
          {step === 'step2' && (
            <Step2Analysis 
              key="step2" 
              photoUrl={currentEntry.photoUrl!} 
              onNext={(state, emotion) => {
                setCurrentEntry({ ...currentEntry, plantState: state, plantEmotion: emotion as PlantEmotion });
                navigateTo('step3');
              }} 
            />
          )}
          {step === 'step3' && (
            <Step3Mood 
              key="step3" 
              plantEmotion={currentEntry.plantEmotion!} 
              initialMood={currentEntry.userMood}
              initialScore={currentEntry.moodScore}
              onNext={(mood, score, analysis) => {
                setCurrentEntry({ 
                  ...currentEntry, 
                  userMood: mood, 
                  moodScore: score, 
                  emotionUnderstanding: analysis.emotionUnderstanding,
                  understandingReason: analysis.understandingReason,
                  nutritionRecommendation: analysis.nutritionRecommendation,
                  nutritionImprovementRate: analysis.nutritionImprovementRate,
                  growthIndex: analysis.growthIndex,
                  aiReflection: analysis.reflection,
                  aiSummary: analysis.summary,
                  recipe: analysis.recipe
                });
                navigateTo('step4');
              }} 
            />
          )}
          {step === 'step4' && (
            <Step4Reflection 
              key="step4" 
              entry={currentEntry as GardenEntry} 
              onComplete={() => {
                saveEntry(currentEntry as GardenEntry);
                setCurrentEntry({});
              }} 
            />
          )}
          {step === 'portfolio' && <PortfolioView key="portfolio" history={history} onBack={() => navigateTo('home')} />}
          {step === 'share' && <ShareView key="share" entry={currentEntry as GardenEntry} onBack={() => navigateTo('home')} />}
          {step === 'shop' && (
            <ShopView 
              key="shop" 
              user={user} 
              onPurchase={(id, price) => {
                const item = SHOP_ITEMS.find(i => i.id === id);
                if (!item) return;
                setUser(prev => ({
                  ...prev,
                  coins: prev.coins - price,
                  purchasedThemes: item.type === 'theme' ? [...prev.purchasedThemes, id as AppTheme] : prev.purchasedThemes,
                  purchasedAccessories: item.type === 'accessory' ? [...prev.purchasedAccessories, id] : prev.purchasedAccessories
                }));
              }}
              onApply={(id, type) => {
                if (type === 'theme') {
                  setUser(prev => ({ ...prev, currentTheme: id as AppTheme }));
                } else {
                  setUser(prev => ({ ...prev, currentAccessory: id || null }));
                }
              }}
              onBack={() => navigateTo('home')}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Menu */}
      {step !== 'login' && (
        <nav className={cn(
          "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-pink-100 p-4 flex justify-around items-center z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]",
          user.currentTheme === 'starry' && "bg-slate-900 border-slate-800"
        )}>
          <NavButton icon={<span className="text-xl">🍓</span>} label="Home" active={step === 'home'} onClick={() => navigateTo('home')} />
          <NavButton icon={<span className="text-xl">🍓</span>} label="시작하기" active={['step1', 'step2', 'step3', 'step4'].includes(step)} onClick={() => navigateTo('step1')} />
          <NavButton icon={<span className="text-xl">🍓</span>} label="상점" active={step === 'shop'} onClick={() => navigateTo('shop')} />
          <NavButton icon={<span className="text-xl">🍓</span>} label="성장 포트폴리오" active={step === 'portfolio'} onClick={() => navigateTo('portfolio')} />
        </nav>
      )}
    </div>
  );
}

// --- Sub-Views ---

function StrawberryCharacter({ accessory }: { accessory: string | null }) {
  const getAccessoryEmoji = (id: string) => {
    switch(id) {
      case 'overalls': return '👖';
      case 'hairpin': return '🌸';
      case 'cowboy-hat': return '🤠';
      case 'ribbon': return '🎀';
      case 'sunglasses': return '🕶️';
      case 'bag': return '👜';
      case 'sneakers': return '👟';
      case 'crown': return '👑';
      default: return null;
    }
  };

  return (
    <div className="relative w-32 h-40 mx-auto flex items-center justify-center">
      {/* Cartoon Strawberry Body */}
      <div className="w-24 h-28 bg-red-500 rounded-[40%_40%_50%_50%] relative shadow-lg border-2 border-red-600 z-0">
        {/* Seeds */}
        <div className="absolute top-8 left-4 w-1 h-1.5 bg-yellow-200 rounded-full opacity-60 rotate-12"></div>
        <div className="absolute top-12 left-10 w-1 h-1.5 bg-yellow-200 rounded-full opacity-60 -rotate-12"></div>
        <div className="absolute top-16 left-6 w-1 h-1.5 bg-yellow-200 rounded-full opacity-60 rotate-6"></div>
        <div className="absolute top-20 left-14 w-1 h-1.5 bg-yellow-200 rounded-full opacity-60 -rotate-6"></div>
        
        {/* Eyes */}
        <div className="absolute top-10 left-6 w-4 h-4 bg-white rounded-full border border-gray-800 flex items-center justify-center">
          <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
        </div>
        <div className="absolute top-10 right-6 w-4 h-4 bg-white rounded-full border border-gray-800 flex items-center justify-center">
          <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
        </div>
        
        {/* Smile */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-6 h-3 border-b-2 border-gray-800 rounded-full"></div>
        
        {/* Leaf Top */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-0.5">
          <div className="w-4 h-8 bg-green-500 rounded-full rotate-[-30deg] origin-bottom"></div>
          <div className="w-4 h-10 bg-green-600 rounded-full origin-bottom"></div>
          <div className="w-4 h-8 bg-green-500 rounded-full rotate-[30deg] origin-bottom"></div>
        </div>
      </div>
      
      {/* Accessory Overlay */}
      {accessory && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className={cn(
            "text-5xl absolute transition-all duration-300",
            accessory === 'cowboy-hat' && "top-2 right-4 rotate-[15deg] scale-110",
            accessory === 'crown' && "-top-4 left-1/2 -translate-x-1/2",
            accessory === 'hairpin' && "top-2 right-4 rotate-[15deg]",
            accessory === 'sunglasses' && "top-10 left-1/2 -translate-x-1/2 scale-125",
            accessory === 'ribbon' && "top-2 right-4 rotate-[15deg] scale-110",
            accessory === 'overalls' && "bottom-4 left-1/2 -translate-x-1/2 scale-[1.4] opacity-90",
            accessory === 'bag' && "bottom-10 left-2 rotate-[-15deg] scale-90",
            accessory === 'sneakers' && "bottom-0 left-1/2 -translate-x-1/2 scale-110"
          )}>
            {getAccessoryEmoji(accessory)}
          </div>
        </div>
      )}
    </div>
  );
}

function HomeView({ navigateTo, history, user, onSample }: { navigateTo: (s: AppStep) => void, history: GardenEntry[], user: UserProfile, onSample: () => void }) {
  const latestScore = history.length > 0 ? history[0].averageScore : 85;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Character and Welcome */}
      <section className="space-y-4 text-center">
        <StrawberryCharacter accessory={user.currentAccessory} />
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-pink-800">나의 감정 정원</h2>
          <p className="text-sm text-pink-600 font-medium">AI 감정 보석 딸기를 키우며 나를 비추고 생명을 소중히 여기는 공간</p>
        </div>
      </section>

      <section className="text-center">
        <p className="text-lg font-bold text-gray-700">반가워요, {user.name}님!</p>
      </section>

      {/* Stats - Average Score Trend */}
      <section className="garden-card p-6 text-center space-y-2 bg-gradient-to-br from-pink-50 to-white border-pink-200 shadow-md">
        <p className="text-pink-600 font-bold uppercase tracking-widest text-xs">최종 감정 이해도 트렌드</p>
        <div className="text-6xl font-black text-pink-500 drop-shadow-sm">{latestScore}%</div>
        <p className="text-xs text-pink-600/60 italic">당신의 마음이 딸기와 함께 무럭무럭 자라고 있어요.</p>
      </section>

      {/* AIM Explanation */}
      <section className="garden-card p-6 bg-pink-50/50 border-pink-100">
        <h3 className="text-lg font-bold text-pink-600 mb-2">A.I.M (Analyze · Inspire · Multiply)</h3>
        <p className="text-sm text-pink-800 leading-relaxed">
          AI가 딸기 사진을 <strong>분석(Analyze)</strong>해 내 감정을 비춰주고, 
          나에게 <strong>영감(Inspire)</strong>을 주며, 
          그 감정을 친구와 가족에게 베풀어 <strong>확산(Multiply)</strong>합니다.
        </p>
      </section>

      {/* Carousel */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-pink-600/60 px-1">친구들의 정원</h2>
        <div className="relative overflow-hidden rounded-2xl bg-pink-50/50 p-4">
          <div className="flex gap-4 animate-scroll w-max">
            {[...MOCK_CAROUSEL_DATA, ...MOCK_CAROUSEL_DATA].map((item, i) => (
              <div key={i} className="relative group cursor-pointer w-[150px] h-[150px] flex-shrink-0">
                <img 
                  src={item.photo} 
                  alt={item.name} 
                  className="w-full h-full object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center rounded-xl">
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-xs">{item.emotion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Experience Button */}
      <button 
        onClick={onSample}
        className="w-full p-6 garden-border bg-gradient-to-r from-pink-50 to-red-50 border-pink-200 rounded-2xl flex items-center justify-between group hover:shadow-lg transition-all"
      >
        <div className="text-left">
          <p className="text-lg font-bold text-pink-600">샘플 데이터로 체험하기</p>
          <p className="text-xs text-pink-400">사진 업로드 없이 전체 흐름을 바로 확인해보세요!</p>
        </div>
        <ChevronRight className="text-pink-400 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* 4-Step Buttons */}
      <section className="grid grid-cols-2 gap-4">
        <StepButton 
          icon={<Camera className="text-pink-500" />} 
          title="Step 1" 
          desc="1단계 사진 업로드" 
          onClick={() => navigateTo('step1')} 
        />
        <StepButton 
          icon={<RefreshCw className="text-green-500" />} 
          title="Step 2" 
          desc="2단계 AI 분석" 
          onClick={() => navigateTo('step2')} 
          disabled={true}
        />
        <StepButton 
          icon={<BookOpen className="text-blue-500" />} 
          title="Step 3" 
          desc="3단계 기분 기록" 
          onClick={() => navigateTo('step3')} 
          disabled={true}
        />
        <StepButton 
          icon={<Heart className="text-red-500" />} 
          title="Step 4" 
          desc="4단계 자신 이해" 
          onClick={() => navigateTo('step4')} 
          disabled={true}
        />
      </section>

      {/* Quote */}
      <section className="p-6 border-t border-pink-100 flex gap-4 items-start">
        <Quote className="text-pink-200 flex-shrink-0" size={32} />
        <p className="text-sm italic text-pink-700 leading-relaxed">
          "이 식물을 돌보는 것은 미래의 생명을 소중히 여기는 법을 가르쳐 줍니다."
        </p>
      </section>
    </motion.div>
  );
}

function Step1Photo({ onNext }: { onNext: (photo: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-pink-800">Step 1: 사진 업로드</h2>
        <p className="text-pink-600">오늘의 딸기 식물 사진을 찍어 상태를 확인해보세요!</p>
      </div>

      <div 
        onClick={() => fileInputRef.current?.click()}
        className="aspect-square w-full garden-card border-2 border-dashed border-pink-200 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-50 transition-colors overflow-hidden"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <>
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mb-4">
              <Camera size={32} />
            </div>
            <p className="font-bold text-pink-800">사진 찍기</p>
            <p className="text-xs text-pink-600">또는 갤러리에서 업로드</p>
          </>
        )}
      </div>

      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFile}
      />

      {preview && (
        <button 
          onClick={() => onNext(preview)}
          className="strawberry-btn strawberry-btn-primary w-full"
        >
          식물 상태 확인하기 <ChevronRight size={20} />
        </button>
      )}
    </motion.div>
  );
}

function Step2Analysis({ photoUrl, onNext }: { photoUrl: string, onNext: (state: string, emotion: string) => void }) {
  const [analysis, setAnalysis] = useState<{ state: string, emotion: string, reason: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const result = await analyzePlant(photoUrl);
        setAnalysis(result);
      } catch (e) {
        console.error(e);
        setAnalysis({ state: "건강함", emotion: "happy", reason: "잎이 아주 초록초록하고 생기가 넘쳐요!" });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [photoUrl]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-pink-800">Step 2: AI 분석</h2>
        <p className="text-pink-600">Gemini가 당신의 식물을 살펴보고 있어요...</p>
      </div>

      <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
        <img src={photoUrl} alt="Plant" className="w-full h-full object-cover" />
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
            <RefreshCw className="animate-spin text-pink-500 mb-2" size={40} />
            <p className="font-bold text-pink-800">분석 중...</p>
          </div>
        )}
      </div>

      {analysis && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="garden-card p-6 space-y-4"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">{EMOTION_EMOJIS[analysis.emotion as PlantEmotion] || '🍓'}</div>
            <div>
              <p className="text-sm text-pink-600 uppercase font-bold tracking-widest">식물의 감정</p>
              <p className={cn("text-2xl font-black capitalize", EMOTION_COLORS[analysis.emotion as PlantEmotion])}>
                {analysis.emotion}
              </p>
            </div>
          </div>
          <p className="text-pink-800 leading-relaxed italic">
            "{analysis.reason}"
          </p>
          <button 
            onClick={() => onNext(analysis.state, analysis.emotion)}
            className="strawberry-btn strawberry-btn-secondary w-full"
          >
            나의 기분 기록하기 <ChevronRight size={20} />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

function Step3Mood({ plantEmotion, initialMood = '', initialScore = 50, onNext }: { plantEmotion: PlantEmotion, initialMood?: string, initialScore?: number, onNext: (mood: string, score: number, analysis: any) => void }) {
  const [mood, setMood] = useState(initialMood);
  const [score, setScore] = useState(initialScore);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await reflectMood(plantEmotion, mood, score);
      onNext(mood, score, result);
    } catch (e) {
      console.error(e);
      onNext(mood, score, { 
        emotionUnderstanding: 80, 
        understandingReason: "당신의 기분은 식물과 80% 일치하지만, 말 속에 약간의 피로함이 숨어있네요.",
        nutritionRecommendation: "비타민 C",
        nutritionImprovementRate: 75,
        growthIndex: 10,
        aiReflection: "당신의 기분은 식물과 80% 일치하지만, 말 속에 약간의 피로함이 숨어있네요.",
        summary: "당신은 정말 잘하고 있어요! 조금만 휴식을 취해보세요.",
        recipe: "피로 회복을 위한 요거트 딸기 레모네이드"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-pink-800">Step 3: 기분 기록</h2>
        <p className="text-pink-600">오늘 기분이 어떤가요? 자신에게 솔직해지는 시간이에요.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-pink-700">오늘의 기분</label>
          <textarea 
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="조금 피곤하지만 딸기를 보니 기분이 좋아졌어요..."
            className="w-full garden-card p-4 min-h-[120px] focus:ring-2 focus:ring-pink-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-pink-700">기분 점수</label>
            <span className="text-2xl font-black text-pink-500">{score}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value))}
            className="w-full accent-pink-500 h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-2xl px-1">
            <span>😢</span>
            <span>😐</span>
            <span>😊</span>
            <span>🤩</span>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={!mood || loading}
          className="strawberry-btn strawberry-btn-primary w-full disabled:opacity-50"
        >
          {loading ? <RefreshCw className="animate-spin" /> : "식물과 비교하기"} <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}

function Step4Reflection({ entry, onComplete }: { entry: GardenEntry, onComplete: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-pink-800">Step 4: 자신 이해</h2>
        <p className="text-pink-600">정원을 통해 나를 더 깊이 이해하는 시간입니다.</p>
      </div>

      <div className="garden-card p-6 space-y-6">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-pink-50 rounded-xl">
            <p className="text-[10px] text-pink-600 font-bold">감정 이해도</p>
            <p className="text-xl font-black text-pink-500">{entry.emotionUnderstanding}%</p>
          </div>
          <div className="p-2 bg-rose-50 rounded-xl">
            <p className="text-[10px] text-rose-600 font-bold">영양 개선</p>
            <p className="text-xl font-black text-rose-500">{entry.nutritionImprovementRate}%</p>
          </div>
          <div className="p-2 bg-pink-100 rounded-xl">
            <p className="text-[10px] text-pink-700 font-bold">성장 지수</p>
            <p className="text-xl font-black text-pink-600">{entry.growthIndex}%</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-pink-50">
            <h3 className="text-sm font-bold text-pink-800 mb-2 flex items-center gap-2">
              <Droplets size={16} className="text-blue-500" /> AI의 성찰
            </h3>
            <p className="text-sm text-pink-700 leading-relaxed italic">
              "{entry.aiReflection}"
            </p>
            <p className="text-xs text-pink-500 mt-2 font-medium">
              * {entry.understandingReason}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-pink-50">
            <h3 className="text-sm font-bold text-pink-800 mb-2 flex items-center gap-2">
              <Quote size={16} className="text-amber-500" /> 감정 영양 추천
            </h3>
            <p className="text-sm text-pink-700 leading-relaxed">
              추천 영양소: <strong>{entry.nutritionRecommendation}</strong>
            </p>
            <p className="text-xs text-pink-500 mt-1">
              이 영양을 챙기면 기분이 {entry.nutritionImprovementRate}% 더 좋아질 거예요!
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-pink-50">
            <h3 className="text-sm font-bold text-pink-800 mb-2 flex items-center gap-2">
              <Heart size={16} className="text-red-500" /> 생명 존중 메시지
            </h3>
            <p className="text-sm text-pink-700 leading-relaxed">
              {entry.aiSummary}
            </p>
          </div>
        </div>

        <button 
          onClick={onComplete}
          className="strawberry-btn strawberry-btn-secondary w-full"
        >
          정원에 저장하고 코인 받기 <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}

function PortfolioView({ history, onBack }: { history: GardenEntry[], onBack: () => void }) {
  const [selectedEntry, setSelectedEntry] = useState<GardenEntry | null>(null);

  const chartData = [...history].reverse().map(e => ({
    date: new Date(e.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
    score: e.averageScore || e.emotionUnderstanding
  }));

  const events = history.map(e => ({
    title: e.emotionUnderstanding >= 80 ? '🍓' : e.emotionUnderstanding >= 60 ? '🌱' : '🔘',
    date: e.date.split('T')[0],
    extendedProps: e,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    textColor: e.emotionUnderstanding >= 80 ? '#ef4444' : e.emotionUnderstanding >= 60 ? '#22c55e' : '#71717a'
  }));

  const handleDateClick = (info: any) => {
    const entry = info.event.extendedProps as GardenEntry;
    setSelectedEntry(entry);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-12"
    >
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-pink-50 rounded-full"><ArrowLeft /></button>
        <h2 className="text-2xl font-bold text-pink-800">성장 포트폴리오</h2>
      </div>

      <section className="garden-card p-4 h-[250px]">
        <h3 className="text-sm font-bold text-pink-700 mb-4">감정 이해도 트렌드</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fff1f2" />
            <XAxis dataKey="date" fontSize={10} tick={{ fill: '#9f1239' }} />
            <YAxis fontSize={10} tick={{ fill: '#9f1239' }} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Line type="monotone" dataKey="score" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e' }} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="garden-card p-4">
        <h3 className="text-sm font-bold text-pink-700 mb-4">감정 정원 달력</h3>
        <div className="calendar-container text-xs">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleDateClick}
            headerToolbar={{
              left: 'prev',
              center: 'title',
              right: 'next'
            }}
            height="auto"
          />
        </div>
        <div className="mt-4 flex justify-around text-[10px] font-bold">
          <div className="flex items-center gap-1 text-red-500">🍓 80% 이상 (싱싱함)</div>
          <div className="flex items-center gap-1 text-green-500">🌱 60-80% (성장중)</div>
          <div className="flex items-center gap-1 text-zinc-500">🔘 60% 미만 (씨앗)</div>
        </div>
      </section>

      {/* Detail Popup */}
      <AnimatePresence>
        {selectedEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl overflow-y-auto max-h-[80vh]"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-pink-800">{new Date(selectedEntry.date).toLocaleDateString()}의 기록</h3>
                <button onClick={() => setSelectedEntry(null)} className="p-1 hover:bg-red-50 text-red-500 rounded-full">✕</button>
              </div>
              
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-inner bg-pink-50">
                <img src={selectedEntry.photoUrl} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-pink-50 rounded-xl space-y-1">
                  <p className="text-xs font-bold text-pink-700">나의 기분 기록</p>
                  <p className="text-sm text-gray-700">{selectedEntry.userMood}</p>
                </div>

                <div className="p-3 bg-blue-50 rounded-xl space-y-1">
                  <p className="text-xs font-bold text-blue-700">AI 성찰 피드백</p>
                  <p className="text-sm text-gray-700 italic">"{selectedEntry.aiReflection}"</p>
                </div>

                <div className="p-3 bg-green-50 rounded-xl space-y-1">
                  <p className="text-xs font-bold text-green-700">딸기 상태 분석</p>
                  <p className="text-sm text-gray-700 font-bold">{selectedEntry.plantState} ({EMOTION_EMOJIS[selectedEntry.plantEmotion]})</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-pink-100 rounded-lg text-center">
                    <p className="text-[8px] font-bold text-pink-700">이해도</p>
                    <p className="text-xs font-black text-pink-600">{selectedEntry.emotionUnderstanding}%</p>
                  </div>
                  <div className="p-2 bg-rose-100 rounded-lg text-center">
                    <p className="text-[8px] font-bold text-rose-700">영양추천</p>
                    <p className="text-xs font-black text-rose-600">{selectedEntry.nutritionImprovementRate}%</p>
                  </div>
                  <div className="p-2 bg-pink-200 rounded-lg text-center">
                    <p className="text-[8px] font-bold text-pink-800">성장지수</p>
                    <p className="text-xs font-black text-pink-700">{selectedEntry.growthIndex}%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LoginView({ user, onLogin }: { user: UserProfile, onLogin: (name: string) => void }) {
  const [name, setName] = useState(user.name);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 text-center"
    >
      <div className="w-24 h-24 bg-pink-500 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-bounce">
        <Heart size={48} fill="currentColor" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-pink-800">나의 감정 정원</h1>
        <p className="text-pink-600">사용자 이름 설정</p>
      </div>

      <div className="w-full space-y-4">
        <div className="space-y-2 text-left">
          <label className="text-xs font-bold text-pink-700 ml-2">이름을 입력해주세요</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full garden-card p-4 text-center text-lg font-bold text-pink-800 outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <button 
          onClick={() => onLogin(name)}
          className="strawberry-btn strawberry-btn-primary w-full text-lg py-4"
        >
          정원 입장하기
        </button>
        <button 
          onClick={() => setName(`사용자${Math.floor(Math.random() * 1000)}`)}
          className="strawberry-btn border border-pink-200 text-pink-600 w-full py-2 text-sm"
        >
          내 이름으로 바꾸기
        </button>
      </div>
    </motion.div>
  );
}

function ShopView({ user, onPurchase, onApply, onBack }: { user: UserProfile, onPurchase: (id: string, price: number) => void, onApply: (id: string, type: 'theme' | 'accessory') => void, onBack: () => void }) {
  const [category, setCategory] = useState<'theme' | 'accessory'>('theme');

  const filteredItems = SHOP_ITEMS.filter(item => item.type === category);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8 pb-12"
    >
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-pink-50 rounded-full"><ArrowLeft /></button>
        <h2 className="text-2xl font-bold text-pink-800">정원 꾸미기 상점</h2>
      </div>

      <div className="garden-card p-4 bg-amber-50 border-amber-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold">C</div>
          <span className="font-bold text-amber-800">보유 코인</span>
        </div>
        <span className="text-2xl font-black text-amber-600">{user.coins}</span>
      </div>

      <div className="flex gap-2 p-1 bg-pink-50 rounded-2xl">
        <button 
          onClick={() => setCategory('theme')}
          className={cn(
            "flex-1 py-2 rounded-xl text-sm font-bold transition-all",
            category === 'theme' ? "bg-white text-pink-600 shadow-sm" : "text-pink-300"
          )}
        >
          배경 테마
        </button>
        <button 
          onClick={() => setCategory('accessory')}
          className={cn(
            "flex-1 py-2 rounded-xl text-sm font-bold transition-all",
            category === 'accessory' ? "bg-white text-pink-600 shadow-sm" : "text-pink-300"
          )}
        >
          캐릭터 아이템
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4">
          {filteredItems.map((item) => {
            const isPurchased = item.type === 'theme' 
              ? user.purchasedThemes.includes(item.id as AppTheme)
              : user.purchasedAccessories.includes(item.id);
            
            const isApplied = item.type === 'theme'
              ? user.currentTheme === item.id
              : user.currentAccessory === item.id;

            return (
              <div key={item.id} className="garden-card p-4 flex items-center justify-between group">
                <div className="space-y-1">
                  <p className="font-bold text-pink-800">{item.name}</p>
                  <p className="text-xs text-pink-600">{item.description}</p>
                  {!isPurchased && (
                    <div className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                      <span>{item.price} 코인</span>
                    </div>
                  )}
                </div>
                
                {isPurchased ? (
                  <button 
                    onClick={() => onApply(item.id, item.type as 'theme' | 'accessory')}
                    disabled={isApplied}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold transition-all",
                      isApplied 
                        ? "bg-pink-100 text-pink-600" 
                        : "bg-pink-500 text-white hover:bg-pink-600"
                    )}
                  >
                    {isApplied ? '적용됨' : '적용하기'}
                  </button>
                ) : (
                  <button 
                    onClick={() => onPurchase(item.id, item.price)}
                    disabled={user.coins < item.price}
                    className="px-4 py-2 bg-amber-500 text-white rounded-full text-xs font-bold hover:bg-amber-600 disabled:opacity-50 transition-all"
                  >
                    구매하기
                  </button>
                )}
              </div>
            );
          })}
          
          {category === 'theme' && (
            <div className="garden-card p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-bold text-pink-800">기본 정원 배경</p>
                <p className="text-xs text-pink-600">따뜻한 화이트 핑크 정원</p>
              </div>
              <button 
                onClick={() => onApply('default', 'theme')}
                disabled={user.currentTheme === 'default'}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all",
                  user.currentTheme === 'default' 
                    ? "bg-pink-100 text-pink-600" 
                    : "bg-pink-500 text-white hover:bg-pink-600"
                )}
              >
                {user.currentTheme === 'default' ? '적용됨' : '적용하기'}
              </button>
            </div>
          )}

          {category === 'accessory' && (
            <div className="garden-card p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-bold text-pink-800">착용 안 함</p>
                <p className="text-xs text-pink-600">아이템을 벗습니다</p>
              </div>
              <button 
                onClick={() => onApply('', 'accessory')}
                disabled={user.currentAccessory === null || user.currentAccessory === ''}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all",
                  (user.currentAccessory === null || user.currentAccessory === '')
                    ? "bg-pink-100 text-pink-600" 
                    : "bg-pink-500 text-white hover:bg-pink-600"
                )}
              >
                {(user.currentAccessory === null || user.currentAccessory === '') ? '적용됨' : '적용하기'}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ShareView({ entry, onBack }: { entry: GardenEntry, onBack: () => void }) {
  if (!entry.id) return <div className="text-center p-12">공유할 기록이 아직 없어요!</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-pink-50 rounded-full"><ArrowLeft /></button>
        <h2 className="text-2xl font-bold text-pink-800">공유하고 베풀기</h2>
      </div>

      <div className="garden-card p-6 space-y-6 text-center">
        <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mx-auto">
          <Droplets size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-pink-800">당신을 위한 특별한 레시피</h3>
          <p className="text-sm text-pink-600">당신의 기분에 맞춰 AI가 추천하는 딸기 레모네이드입니다.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-pink-50 text-left">
          <div className="markdown-body">
            <Markdown>
              {entry.recipe}
            </Markdown>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-pink-50">
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-pink-50">
              <QRCodeSVG value={JSON.stringify({ id: entry.id, understanding: entry.emotionUnderstanding })} size={150} />
            </div>
          </div>
          <p className="text-xs text-pink-600">QR코드를 스캔하여 나의 기분 요약과 레시피를 공유하세요!</p>
        </div>

        <button className="strawberry-btn strawberry-btn-primary w-full">
          <Share2 size={20} /> 친구에게 공유하기
        </button>
      </div>
    </motion.div>
  );
}

// --- Helper Components ---

function NavButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all flex-1",
        active ? "text-pink-600 scale-110" : "text-pink-200 hover:text-pink-400"
      )}
    >
      <div className="relative">
        {icon}
        {active && (
          <div className="absolute -top-1 -right-1 text-[8px]">🍓</div>
        )}
      </div>
      <span className="text-[9px] font-bold tracking-tighter">{label}</span>
      {active && <motion.div layoutId="nav-dot" className="w-1 h-1 bg-pink-600 rounded-full" />}
    </button>
  );
}

function StepButton({ icon, title, desc, onClick, disabled }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void, disabled?: boolean }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "garden-card p-4 flex flex-col items-center text-center gap-2 transition-all active:scale-95",
        disabled ? "opacity-40 grayscale cursor-not-allowed" : "hover:shadow-md hover:-translate-y-1"
      )}
    >
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-pink-600/60 uppercase">{title}</p>
        <p className="text-sm font-bold text-pink-800">{desc}</p>
      </div>
    </button>
  );
}
