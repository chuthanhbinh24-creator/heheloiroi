import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Loader2, Sparkles, Download, Image as ImageIcon, 
  Smile, Frown, Droplets, Angry, Moon, Star,
  Leaf, Coffee, Book, Gamepad2, Music, Bed,
  GraduationCap, Headphones, Briefcase, Snowflake, Sun, ChefHat,
  Hand, Heart, ThumbsUp, MessageCircle, HelpCircle, PartyPopper
} from 'lucide-react';
import { generatePanda } from './lib/gemini';

const CATEGORIES = [
  {
    id: 'emotion',
    label: '😄 Cảm xúc',
    options: [
      { id: 'happy', label: 'Vui vẻ', prompt: 'happy expression, smiling brightly', icon: Smile, color: 'bg-pink-100 text-pink-600 border-pink-200' },
      { id: 'sad', label: 'Buồn bã', prompt: 'sad expression, teary eyes', icon: Frown, color: 'bg-blue-100 text-blue-600 border-blue-200' },
      { id: 'cry', label: 'Khóc', prompt: 'crying with tears', icon: Droplets, color: 'bg-cyan-100 text-cyan-600 border-cyan-200' },
      { id: 'angry', label: 'Tức giận', prompt: 'angry, puffed cheeks', icon: Angry, color: 'bg-red-100 text-red-600 border-red-200' },
      { id: 'sleepy', label: 'Buồn ngủ', prompt: 'sleepy, yawning', icon: Moon, color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
      { id: 'excited', label: 'Hào hứng', prompt: 'excited, sparkling eyes', icon: Star, color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
    ]
  },
  {
    id: 'action',
    label: '🍔 Hoạt động',
    options: [
      { id: 'eat_bamboo', label: 'Ăn trúc', prompt: 'eating bamboo', icon: Leaf, color: 'bg-green-100 text-green-600 border-green-200' },
      { id: 'milk_tea', label: 'Uống trà sữa', prompt: 'drinking milk tea', icon: Coffee, color: 'bg-amber-100 text-amber-600 border-amber-200' },
      { id: 'study', label: 'Học bài', prompt: 'studying with books', icon: Book, color: 'bg-blue-100 text-blue-600 border-blue-200' },
      { id: 'play_game', label: 'Chơi game', prompt: 'playing games', icon: Gamepad2, color: 'bg-purple-100 text-purple-600 border-purple-200' },
      { id: 'dance', label: 'Nhảy múa', prompt: 'dancing happily', icon: Music, color: 'bg-rose-100 text-rose-600 border-rose-200' },
      { id: 'sleep_pillow', label: 'Ngủ ôm gối', prompt: 'sleeping with pillow', icon: Bed, color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
    ]
  },
  {
    id: 'theme',
    label: '🎭 Chủ đề',
    options: [
      { id: 'student', label: 'Học sinh', prompt: 'school student outfit', icon: GraduationCap, color: 'bg-sky-100 text-sky-600 border-sky-200' },
      { id: 'gamer', label: 'Gamer', prompt: 'gamer style with headphones', icon: Headphones, color: 'bg-violet-100 text-violet-600 border-violet-200' },
      { id: 'office', label: 'Văn phòng', prompt: 'office worker', icon: Briefcase, color: 'bg-slate-100 text-slate-600 border-slate-200' },
      { id: 'winter', label: 'Mùa đông', prompt: 'winter outfit with scarf', icon: Snowflake, color: 'bg-cyan-100 text-cyan-600 border-cyan-200' },
      { id: 'summer', label: 'Mùa hè', prompt: 'summer beach style', icon: Sun, color: 'bg-orange-100 text-orange-600 border-orange-200' },
      { id: 'chef', label: 'Đầu bếp', prompt: 'cute chef cooking', icon: ChefHat, color: 'bg-red-100 text-red-600 border-red-200' },
    ]
  },
  {
    id: 'social',
    label: '💕 Tình huống',
    options: [
      { id: 'hello', label: 'Xin chào', prompt: 'waving hello', icon: Hand, color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
      { id: 'hug_heart', label: 'Thả tim', prompt: 'hugging a heart', icon: Heart, color: 'bg-pink-100 text-pink-600 border-pink-200' },
      { id: 'thanks', label: 'Cảm ơn', prompt: 'saying thank you', icon: ThumbsUp, color: 'bg-blue-100 text-blue-600 border-blue-200' },
      { id: 'sorry', label: 'Xin lỗi', prompt: 'saying sorry', icon: MessageCircle, color: 'bg-orange-100 text-orange-600 border-orange-200' },
      { id: 'confused', label: 'Bối rối', prompt: 'confused with question marks', icon: HelpCircle, color: 'bg-purple-100 text-purple-600 border-purple-200' },
      { id: 'celebrate', label: 'Ăn mừng', prompt: 'celebrating with confetti', icon: PartyPopper, color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
    ]
  }
];

interface GeneratedImage {
  id: string;
  url: string;
  label: string;
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [selectedOption, setSelectedOption] = useState(CATEGORIES[0].options[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const url = await generatePanda(selectedOption.prompt);
      setImages(prev => [{
        id: Date.now().toString(),
        url,
        label: selectedOption.label
      }, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tạo hình ảnh');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (url: string, id: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `gau-truc-kawaii-${id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const currentCategory = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans text-slate-800 selection:bg-pink-200">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4"
        >
          <span className="text-3xl">🐼</span>
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-3"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Tạo Gấu Trúc Kawaii
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-500 max-w-md mx-auto"
        >
          Tạo nhãn dán gấu trúc chibi đáng yêu với nhiều biểu cảm và hành động bằng AI.
        </motion.p>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-20">
        {/* Controls */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-12"
        >
          <div className="flex flex-col gap-6">
            
            {/* Category Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                  }}
                  className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all duration-200 ${
                    activeCategory === cat.id 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
              <div className="flex-1 w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {currentCategory.options.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = selectedOption.id === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedOption(opt)}
                        className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                          isSelected 
                            ? `${opt.color} scale-105 shadow-sm z-10` 
                            : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                        }`}
                      >
                        <Icon className="w-6 h-6 mb-2" />
                        <span className="font-medium text-sm text-center leading-tight">{opt.label}</span>
                        {isSelected && (
                          <motion.div 
                            layoutId="outline"
                            className="absolute inset-0 border-2 border-current rounded-2xl"
                            initial={false}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="w-full lg:w-auto flex flex-col items-center justify-center pt-4 lg:pt-0 lg:pl-8 lg:border-l border-slate-100">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-medium text-lg overflow-hidden transition-transform active:scale-95 disabled:opacity-70 disabled:active:scale-100 w-full lg:w-auto cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center gap-2">
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang tạo...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Tạo Gấu Trúc</span>
                      </>
                    )}
                  </div>
                </button>
                {error && (
                  <p className="text-red-500 text-sm mt-3 text-center max-w-xs">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gallery */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-slate-400" />
              Bộ Sưu Tập
            </h2>
            <span className="text-sm font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              {images.length} nhãn dán
            </span>
          </div>

          {images.length === 0 ? (
            <div className="bg-white/50 border border-slate-100 border-dashed rounded-3xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-1">Chưa có gấu trúc nào</h3>
              <p className="text-slate-500">Chọn một tùy chỉnh và nhấn tạo để có nhãn dán đầu tiên của bạn!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {images.map((image) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                    className="group relative bg-white rounded-3xl p-4 shadow-sm border border-slate-100 overflow-hidden"
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4 relative">
                      <img 
                        src={image.url} 
                        alt={`Gấu trúc: ${image.label}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={() => handleDownload(image.url, image.id)}
                          className="bg-white text-slate-900 p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
                          title="Tải nhãn dán"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2">
                      <span className="text-sm font-medium text-slate-600 capitalize">
                        {image.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(parseInt(image.id)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
