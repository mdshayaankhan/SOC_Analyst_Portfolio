import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Sparkles, ChevronRight } from 'lucide-react';

const botQuotes = [
  "Welcome! I am MD-SecBot, your cybersecurity companion.",
  "All systems operational. Network grid looks clear.",
  "Tip: You can query log summaries in the shell interface.",
  "Intrusion status: 0 active threats detected. System is safe.",
  "Want to explore? Use the buttons in my status bubble!",
  "Certificates decrypted! Scroll to Node 07 to view them.",
  "Wazuh telemetry feed: Ingesting logs successfully."
];

const CyberBot = ({ isTerminalOpen, onToggleTerminal }) => {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [botAnimationState, setBotAnimationState] = useState('idle');
  const botRef = useRef(null);

  // Cycle dialog quotes
  useEffect(() => {
    const interval = setInterval(() => {
      if (showBubble && !isTerminalOpen) {
        setQuoteIdx((prev) => (prev + 1) % botQuotes.length);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [showBubble, isTerminalOpen]);

  // Periodic Cute Blinking Animation
  useEffect(() => {
    const blinkCycle = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 160);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        blinkCycle();
      }
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  // Track cursor coordinates relative to the bot center for interactive tracking eyes
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!botRef.current) return;
      const rect = botRef.current.getBoundingClientRect();
      const botCenterX = rect.left + rect.width / 2;
      const botCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - botCenterX;
      const dy = e.clientY - botCenterY;
      const dist = Math.hypot(dx, dy);

      const maxDisplacement = 5;
      if (dist > 0) {
        const factor = Math.min(maxDisplacement, dist * 0.025);
        setEyeOffset({
          x: (dx / dist) * factor,
          y: (dy / dist) * factor
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleMascotClick = (e) => {
    e.stopPropagation();
    
    // Play dual-tone sound feedback
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch (err) {}

    // Trigger hop & 360 degree spin!
    setBotAnimationState('jump');
    setTimeout(() => {
      setBotAnimationState(isHovered ? 'hover' : 'idle');
    }, 600);

    // Toggle bubble open/close
    if (showBubble) {
      setShowBubble(false);
    } else {
      const rand = Math.floor(Math.random() * botQuotes.length);
      setQuoteIdx(rand);
      setShowBubble(true);
    }
  };

  useEffect(() => {
    if (isHovered && botAnimationState !== 'jump') {
      setBotAnimationState('hover');
    } else if (!isHovered && botAnimationState !== 'jump') {
      setBotAnimationState('idle');
    }
  }, [isHovered, botAnimationState]);

  // Animation variants
  const mascotVariants = {
    idle: {
      y: [0, -6, 0],
      rotate: 0,
      scale: 1,
      transition: { repeat: Infinity, duration: 4, ease: "easeInOut" }
    },
    hover: {
      y: [0, -3, 0],
      scale: 1.08,
      rotate: [-1.5, 1.5, -1.5],
      transition: { repeat: Infinity, duration: 1.6, ease: "easeInOut" }
    },
    jump: {
      y: [0, -22, 0],
      rotate: [0, 360],
      scale: [1, 1.15, 0.9, 1],
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  return (
    <div className="fixed bottom-8 right-6 z-40 font-mono flex items-end gap-3.5 pointer-events-none select-none max-w-[calc(100vw-2rem)]">
      
      {/* 1. Holographic Speech/Task Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 20, y: 15 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 20, y: 15 }}
            className="glassmorphism p-3.5 rounded-xl border border-google-red/45 text-left w-60 sm:w-64 shadow-2xl pointer-events-auto bg-cyber-bg-darker/95 relative mb-2"
          >
            {/* Speech pointer pointing to the bot on the right */}
            <div 
              className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 border-r border-t border-google-red/45 transform rotate-45"
              style={{ backgroundColor: 'var(--cyber-bg-darker)' }}
            />
            
            <div className="flex items-center justify-between border-b border-cyber-bg-gray pb-1.5 mb-2 text-[9px] text-google-red font-bold">
              <div className="flex items-center gap-1.5">
                <Shield size={11} className="animate-pulse text-google-red" />
                <span>THM-STYLE AGENT V1.3</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-google-red animate-ping" />
            </div>
            
            {/* Status Text dialogue */}
            <p className="text-[10px] text-cyber-text-light font-sans leading-relaxed font-light mb-3">
              {botQuotes[quoteIdx]}
            </p>

            {/* Tasks list inside bubble */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-cyber-bg-gray/40">
              <button
                onClick={() => {
                  onToggleTerminal();
                  setShowBubble(false);
                }}
                className="w-full text-left py-1 px-2 rounded border border-google-blue/40 bg-google-blue/5 hover:bg-google-blue/15 text-google-blue hover:text-cyber-text-white transition-all text-[9px] font-bold flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  <Terminal size={9} />
                  <span>{isTerminalOpen ? 'CLOSE SECURE SHELL' : 'LAUNCH SECURE SHELL'}</span>
                </span>
                <ChevronRight size={10} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const rand = Math.floor(Math.random() * botQuotes.length);
                  setQuoteIdx(rand);
                }}
                className="w-full text-left py-1 px-2 rounded border border-cyber-bg-gray bg-cyber-bg-gray/20 hover:bg-cyber-bg-gray/40 text-cyber-text-muted hover:text-cyber-text-light transition-all text-[9px] flex items-center justify-between cursor-pointer"
              >
                <span>NEXT STATUS BLOCK</span>
                <Sparkles size={8} className="text-google-yellow" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Interactive Red-Hooded TryHackMe style Mascot Helper Bot */}
      <motion.div
        ref={botRef}
        animate={botAnimationState}
        variants={mascotVariants}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleMascotClick}
        className="w-16 h-16 cursor-pointer pointer-events-auto filter drop-shadow-[0_0_10px_rgba(234,67,53,0.6)] active:scale-95 transition-all"
        title="THM-SecBot - Click to toggle console"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="hoodRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EA4335" />
              <stop offset="100%" stopColor="#a31d12" />
            </linearGradient>
            <linearGradient id="faceDarkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1C1E24" />
              <stop offset="100%" stopColor="#0B0C10" />
            </linearGradient>
          </defs>

          {/* Outer Hood Body (Red Gradient with clean white outline) */}
          <path
            d="M 50 15 
               C 28 15, 20 40, 20 62 
               C 20 78, 31 82, 40 84 
               C 44 85, 45 79, 48 77 
               C 50 76, 50 76, 52 77
               C 55 79, 56 85, 60 84 
               C 69 82, 80 78, 80 62 
               C 80 40, 72 15, 50 15 Z"
            fill="url(#hoodRedGrad)"
            stroke="#ffffff"
            strokeWidth="3.2"
          />

          {/* Wizard Hood tail curve */}
          <path
            d="M 50 15
               C 55 9, 68 7, 77 16
               C 79 18, 77 23, 72 20
               C 67 17, 58 16, 50 15 Z"
            fill="#EA4335"
            stroke="#ffffff"
            strokeWidth="1.5"
          />

          {/* Dark Screen Face */}
          <ellipse
            cx="50"
            cy="53"
            rx="20"
            ry="16"
            fill="url(#faceDarkGrad)"
            stroke="rgba(234, 67, 53, 0.5)"
            strokeWidth="2.5"
          />

          {/* Cute pink blushes when hovered */}
          {isHovered && (
            <g>
              <ellipse cx="33" cy="62" rx="3.5" ry="1.8" fill="rgba(244, 63, 94, 0.65)" filter="blur(0.5px)" />
              <ellipse cx="67" cy="62" rx="3.5" ry="1.8" fill="rgba(244, 63, 94, 0.65)" filter="blur(0.5px)" />
            </g>
          )}

          {/* Pupils container translating based on mouse offsets */}
          <g style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }} className="transition-transform duration-75">
            {isBlinking ? (
              <>
                {/* Cute blinking curved closed eyes */}
                <path d="M 37.5 53 Q 41 55.5 44.5 53" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                <path d="M 55.5 53 Q 59 55.5 62.5 53" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <ellipse cx="41" cy="53" rx="4.5" ry="6.5" fill="#FFFFFF" />
                <ellipse cx="59" cy="53" rx="4.5" ry="6.5" fill="#FFFFFF" />
                
                <circle cx="41.5" cy="51.5" r="1.5" fill="#EA4335" />
                <circle cx="59.5" cy="51.5" r="1.5" fill="#EA4335" />
              </>
            )}
          </g>

          {/* Glowing base reflection underneath bot */}
          <ellipse
            cx="50"
            cy="92"
            rx="22"
            ry="3"
            fill="rgba(234, 67, 53, 0.35)"
            filter="blur(1.5px)"
          />
        </svg>
      </motion.div>

    </div>
  );
};

export default CyberBot;
