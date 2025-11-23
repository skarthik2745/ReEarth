import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface TextToSpeechProps {
  text: string;
  className?: string;
}

export default function TextToSpeech({ text, className = '' }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handlePlay = () => {
    console.log('Play button clicked');
    console.log('Text to speak:', text);
    
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    speechSynthesis.cancel();
    
    const cleanText = (text || 'Test speech').replace(/<[^>]*>/g, '');
    console.log('Clean text:', cleanText);
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      console.log('Speech started');
      setIsPlaying(true);
    };

    utterance.onend = () => {
      console.log('Speech ended');
      setIsPlaying(false);
    };

    utterance.onerror = (e) => {
      console.error('Speech error:', e);
      setIsPlaying(false);
    };

    speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            title="Read aloud"
          >
            <Play className="h-4 w-4" />
            <span className="text-sm font-medium">Listen</span>
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
            title="Pause"
          >
            <Pause className="h-4 w-4" />
            <span className="text-sm font-medium">Pause</span>
          </button>
        )}
        
        {(isPlaying || isPaused) && (
          <button
            onClick={handleStop}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Stop"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {isPlaying && (
        <div className="flex items-center gap-1">
          <div className="w-1 h-3 bg-blue-500 rounded animate-pulse"></div>
          <div className="w-1 h-2 bg-blue-400 rounded animate-pulse delay-75"></div>
          <div className="w-1 h-4 bg-blue-500 rounded animate-pulse delay-150"></div>
        </div>
      )}
    </div>
  );
}