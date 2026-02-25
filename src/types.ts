export type PlantEmotion = 'happy' | 'vibrant' | 'tired' | 'droopy' | 'growing' | 'healthy' | 'wilting';

export interface GardenEntry {
  id: string;
  date: string;
  photoUrl: string;
  plantState: string;
  plantEmotion: PlantEmotion;
  userMood: string;
  moodScore: number;
  emotionUnderstanding: number; // 0-100
  understandingReason: string;
  nutritionRecommendation: string;
  nutritionImprovementRate: number; // 0-100
  growthIndex: number; // 0-100
  averageScore: number; // Average of the 3 scores
  aiReflection: string;
  aiSummary: string;
  recipe: string;
}

export type AppTheme = 'default' | 'clouds' | 'starry' | 'pink-forest' | 'pastel' | 'sunset' | 'ocean' | 'mountain' | 'city' | 'space';

export interface UserProfile {
  name: string;
  coins: number;
  purchasedThemes: AppTheme[];
  currentTheme: AppTheme;
  purchasedAccessories: string[];
  currentAccessory: string | null;
}

export type AppStep = 'login' | 'home' | 'step1' | 'step2' | 'step3' | 'step4' | 'portfolio' | 'share' | 'shop';
