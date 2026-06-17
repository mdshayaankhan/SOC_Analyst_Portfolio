import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Read cached preference on mount
    const cached = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (cached === 'light' || (!cached && systemPrefersLight)) {
      setIsLight(true);
      document.documentElement.classList.add('light');
    } else {
      setIsLight(false);
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    // Play dual-tone sound feedback
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isLight ? 440 : 880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(isLight ? 600 : 350, audioCtx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch (e) {}

    if (isLight) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      setIsLight(false);
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      setIsLight(true);
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={toggleTheme}
      className="fixed top-6 left-6 z-40 w-11 h-11 rounded-full glassmorphism-blue flex items-center justify-center cursor-pointer shadow-xl border border-google-blue/40 hover:scale-110 active:scale-90 transition-all select-none focus:outline-none"
      title={isLight ? 'Switch to Dark Defense Protocol' : 'Switch to Light Operations Mode'}
    >
      <motion.div
        key={isLight ? 'sun' : 'moon'}
        initial={{ rotate: -45, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 45, scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={isLight ? 'text-google-yellow' : 'text-google-blue'}
      >
        {isLight ? <Sun size={18} className="animate-spin" style={{ animationDuration: '24s' }} /> : <Moon size={17} />}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
