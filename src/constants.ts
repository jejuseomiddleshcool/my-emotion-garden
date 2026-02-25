import { PlantEmotion } from './types';

export const EMOTION_EMOJIS: Record<PlantEmotion, string> = {
  happy: '😊',
  vibrant: '✨',
  tired: '😴',
  droopy: '😔',
  growing: '🌱',
  healthy: '💪',
  wilting: '🥀',
};

export const EMOTION_COLORS: Record<PlantEmotion, string> = {
  happy: 'text-red-500',
  vibrant: 'text-pink-500',
  tired: 'text-yellow-600',
  droopy: 'text-brown-600',
  growing: 'text-green-500',
  healthy: 'text-emerald-500',
  wilting: 'text-amber-800',
};

export const MOCK_CAROUSEL_DATA = [
  { name: "김선아", emotion: "오늘 활기차요!", photo: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=150&h=150" }, // 새싹
  { name: "황표진", emotion: "조금 목말라 보이네요", photo: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&w=150&h=150" }, // 시든
  { name: "이지우", emotion: "꽃이 피었어요!", photo: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=150&h=150" }, // 꽃
  { name: "박하은", emotion: "빨갛게 익어가는 중", photo: "https://images.unsplash.com/photo-1543528176-61b2395143a4?auto=format&fit=crop&w=150&h=150" }, // 익은
  { name: "최민준", emotion: "쑥쑥 자라고 있어요", photo: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&w=150&h=150" }, // 잎
  { name: "정다은", emotion: "작은 열매가 맺혔어요", photo: "https://images.unsplash.com/photo-1582131503261-fca1d1c058d2?auto=format&fit=crop&w=150&h=150" }, // 열매
  { name: "윤서준", emotion: "햇살을 듬뿍 받았어요", photo: "https://images.unsplash.com/photo-1516553174826-d05833723cd4?auto=format&fit=crop&w=150&h=150" },
  { name: "강지민", emotion: "싱싱하고 달콤해요", photo: "https://images.unsplash.com/photo-1543528176-61b2395143a4?auto=format&fit=crop&w=150&h=150" },
];

export const SHOP_ITEMS = [
  // Themes (10)
  { id: 'clouds', name: '구름 하늘', price: 10, type: 'theme', description: '몽글몽글 구름이 떠 있는 하늘 배경' },
  { id: 'starry', name: '별이 빛나는 밤', price: 15, type: 'theme', description: '반짝이는 별들이 가득한 밤하늘' },
  { id: 'pink-forest', name: '따뜻한 핑크 숲', price: 12, type: 'theme', description: '포근한 핑크빛이 감도는 신비로운 숲' },
  { id: 'pastel', name: '부드러운 파스텔', price: 8, type: 'theme', description: '마음이 편안해지는 파스텔톤 배경' },
  { id: 'sunset', name: '노을지는 해변', price: 13, type: 'theme', description: '아름다운 주황빛 노을이 지는 바다' },
  { id: 'ocean', name: '깊은 바다 속', price: 11, type: 'theme', description: '시원하고 평화로운 바다 속 풍경' },
  { id: 'mountain', name: '푸른 산맥', price: 9, type: 'theme', description: '상쾌한 공기가 느껴지는 초록 산맥' },
  { id: 'city', name: '반짝이는 도시', price: 14, type: 'theme', description: '화려한 불빛이 빛나는 도시의 밤' },
  { id: 'space', name: '은하수 여행', price: 15, type: 'theme', description: '신비로운 보라빛 은하수가 흐르는 우주' },
  { id: 'garden', name: '비밀의 정원', price: 12, type: 'theme', description: '꽃들이 만발한 나만의 비밀 정원' },
  
  // Accessories (8)
  { id: 'overalls', name: '멜빵바지', price: 10, type: 'accessory', description: '귀여운 청색 멜빵바지' },
  { id: 'hairpin', name: '머리핀', price: 5, type: 'accessory', description: '앙증맞은 꽃 모양 머리핀' },
  { id: 'cowboy-hat', name: '카우보이 모자', price: 12, type: 'accessory', description: '멋쟁이 카우보이 스타일 모자' },
  { id: 'ribbon', name: '리본', price: 6, type: 'accessory', description: '커다란 빨간색 체크 리본' },
  { id: 'sunglasses', name: '선글라스', price: 8, type: 'accessory', description: '힙한 느낌의 검정 선글라스' },
  { id: 'bag', name: '작은 가방', price: 7, type: 'accessory', description: '도토리가 들어있을 것 같은 가방' },
  { id: 'sneakers', name: '운동화', price: 9, type: 'accessory', description: '어디든 달려갈 수 있는 하얀 운동화' },
  { id: 'crown', name: '왕관', price: 12, type: 'accessory', description: '반짝반짝 빛나는 황금 왕관' },
];

export const SAMPLE_DATA = {
  photoUrl: "https://images.unsplash.com/photo-1543528176-61b2395143a4?auto=format&fit=crop&w=500&h=500",
  mood: "오늘은 학교에서 친구들과 딸기 키우기 프로젝트를 시작해서 정말 설레고 기분이 좋아요!",
  score: 90
};

export const STRAWBERRY_CHARACTER = "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=strawberry&backgroundColor=ff4d4d";
