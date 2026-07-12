'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipForward, Volume2, Maximize,
  Check, X, Clock, Award, ChevronRight, ChevronLeft,
  ThumbsUp, ThumbsDown, Heart, MessageCircle, Share2
} from 'lucide-react';

interface VideoPlayerProps {
  title: string;
  description: string;
  duration: number; // en secondes
  thumbnailColor: string;
  thumbnailLetter: string;
  type?: 'video' | 'ad' | 'sponsored' | 'tiktok';
  onComplete: () => void;
}

export function VideoPlayer({ 
  title, 
  description, 
  duration, 
  thumbnailColor,
  thumbnailLetter,
  type = 'video',
  onComplete 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments] = useState(Math.floor(Math.random() * 500) + 50);
  const [shares] = useState(Math.floor(Math.random() * 100) + 10);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            setIsCompleted(true);
            setShowReward(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return duration;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isCompleted, duration]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const progress = (currentTime / duration) * 100;
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const typeLabel = {
    video: 'Vidéo',
    ad: 'Publicité',
    sponsored: 'Sponsorisé',
    tiktok: 'TikTok'
  };

  const rewardAmount = type === 'ad' ? 0.50 : type === 'sponsored' ? 2.50 : type === 'tiktok' ? 3.00 : 1.00;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Video Container */}
      <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
        {/* Animated "Video" Content */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            background: `linear-gradient(135deg, ${thumbnailColor}, ${thumbnailColor}dd, ${thumbnailColor}aa)`,
            animation: isPlaying ? 'videoGradient 8s ease infinite' : 'none'
          }}
        >
          {/* Animated elements when playing */}
          {isPlaying && (
            <>
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-yellow-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              <div className="relative z-10 text-center">
                <div 
                  className="text-8xl font-bold text-white/90 mb-4"
                  style={{ animation: 'bounce 2s infinite' }}
                >
                  {thumbnailLetter}
                </div>
                <div className="text-white text-2xl font-bold font-display">{title}</div>
                <div className="text-white/70 mt-2">{typeLabel[type]} en cours...</div>
              </div>
            </>
          )}
          
          {/* Big thumbnail when paused */}
          {!isPlaying && !isCompleted && (
            <div className="text-center">
              <div className="text-9xl font-bold text-white/30 mb-4">{thumbnailLetter}</div>
              <button
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-accent hover:bg-yellow-500 flex items-center justify-center transition-transform hover:scale-110 mx-auto"
              >
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              </button>
              <div className="text-white mt-4 font-semibold">{title}</div>
            </div>
          )}

          {/* Completion overlay */}
          {isCompleted && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-center animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-success flex items-center justify-center">
                  <Check className="w-12 h-12 text-white" />
                </div>
                <div className="text-white text-2xl font-bold mb-2">Terminé !</div>
                <div className="text-accent font-bold text-3xl font-display">+{rewardAmount}€</div>
              </div>
            </div>
          )}
        </div>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              {isPlaying ? '● EN DIRECT' : typeLabel[type].toUpperCase()}
            </span>
            <span className="text-white/80 text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          {/* Progress bar */}
          <div className="mb-3">
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={togglePlay}
                disabled={isCompleted}
                className="text-white hover:text-accent transition-colors disabled:opacity-50"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <Volume2 className="w-5 h-5 text-white/70" />
              <span className="text-white/70 text-sm">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <SkipForward className="w-5 h-5 text-white/70" />
              <Maximize className="w-5 h-5 text-white/70" />
            </div>
          </div>
        </div>
      </div>

      {/* TikTok-style interactions */}
      {type === 'tiktok' && (
        <div className="mt-4 flex items-center justify-around bg-white rounded-2xl p-4 shadow-lg">
          <button 
            onClick={() => setLikes(l => l + 1)}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-red-500"
          >
            <Heart className={`w-6 h-6 ${likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
            <span className="text-xs font-medium">{likes + 1247}</span>
          </button>
          <div className="flex flex-col items-center gap-1 text-gray-600">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-medium">{comments}</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-600">
            <Share2 className="w-6 h-6" />
            <span className="text-xs font-medium">{shares}</span>
          </div>
        </div>
      )}

      {/* Reward popup */}
      {showReward && (
        <div className="mt-4 bg-gradient-to-r from-accent to-yellow-500 rounded-2xl p-6 text-white animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="font-bold text-lg">Récompense gagnée !</div>
                <div className="text-white/80 text-sm">Vous avez regardé la vidéo complète</div>
              </div>
            </div>
            <div className="text-3xl font-bold font-display">+{rewardAmount}€</div>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mt-4 bg-white rounded-2xl p-4 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTime(duration)}</span>
          <span className="flex items-center gap-1"><Award className="w-3 h-3" /> +{rewardAmount}€</span>
        </div>
      </div>
    </div>
  );
}
