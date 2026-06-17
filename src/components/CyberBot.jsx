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
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [eyeLookOffset, setEyeLookOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const botRef = useRef(null);

  const isListening = isTerminalOpen;

  // Cycle dialog quotes
  useEffect(() => {
    const interval = setInterval(() => {
      if (showBubble && !isTerminalOpen && !isThinking) {
        setQuoteIdx((prev) => (prev + 1) % botQuotes.length);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [showBubble, isTerminalOpen, isThinking]);

  // Periodic Cute Blinking
  useEffect(() => {
    const blinkCycle = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 160);
    };

    const interval = setInterval(() => {
      if (!isBlinking && Math.random() > 0.3) {
        blinkCycle();
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isBlinking]);

  // Periodic looking around when idle
  useEffect(() => {
    const lookInterval = setInterval(() => {
      if (isHovered || isThinking) return;
      const rand = Math.random();
      if (rand < 0.25) {
        setEyeLookOffset({ x: -2.0, y: 0 });
        setTimeout(() => setEyeLookOffset({ x: 0, y: 0 }), 1400);
      } else if (rand < 0.5) {
        setEyeLookOffset({ x: 2.0, y: 0 });
        setTimeout(() => setEyeLookOffset({ x: 0, y: 0 }), 1400);
      }
    }, 7000);

    return () => clearInterval(lookInterval);
  }, [isHovered, isThinking]);

  // Track cursor offsets relative to the bot center
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!botRef.current) return;
      const rect = botRef.current.getBoundingClientRect();
      const botCenterX = rect.left + rect.width / 2;
      const botCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - botCenterX;
      const dy = e.clientY - botCenterY;
      const dist = Math.hypot(dx, dy);

      const maxDisplacement = 3.5;
      if (dist > 0) {
        const factor = Math.min(maxDisplacement, dist * 0.025);
        setMouseOffset({
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
    
    // Play sci-fi system chime sound
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (err) {}

    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      const rand = Math.floor(Math.random() * botQuotes.length);
      setQuoteIdx(rand);
      if (!showBubble) {
        setShowBubble(true);
      }
    }, 1500);
  };

  const activeEyeOffset = isHovered 
    ? mouseOffset 
    : eyeLookOffset;

  // Unified Floating container variants
  const containerVariants = {
    idle: {
      y: [0, -8, 0],
      transition: { repeat: Infinity, duration: 4.8, ease: "easeInOut" }
    },
    hover: {
      y: [0, -6, 0],
      scale: 1.05,
      transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 font-mono flex items-end gap-3.5 pointer-events-none select-none max-w-[calc(100vw-2rem)] lg:bottom-8 lg:right-8 lg:flex-row flex-col-reverse justify-end items-center lg:items-end">
      
      {/* 1. Holographic Speech/Task Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 20, y: 15 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 20, y: 15 }}
            className="glassmorphism p-3.5 rounded-xl border border-google-red/45 text-left w-60 sm:w-64 shadow-2xl pointer-events-auto bg-cyber-bg-darker/95 relative mb-2"
          >
            <div 
              className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 border-r border-t border-google-red/45 transform rotate-45"
              style={{ backgroundColor: 'var(--cyber-bg-darker)' }}
            />
            
            <div className="flex items-center justify-between border-b border-cyber-bg-gray pb-1.5 mb-2 text-[9px] text-google-red font-bold">
              <div className="flex items-center gap-1.5">
                <Shield size={11} className="animate-pulse text-google-red" />
                <span>SEC-BOT COGNITIVE GRID</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-google-red animate-ping" />
            </div>
            
            <p className="text-[10px] text-cyber-text-light font-sans leading-relaxed font-light mb-3 min-h-[30px]">
              {isThinking ? "Processing network vector node..." : botQuotes[quoteIdx]}
            </p>

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
                  setIsThinking(true);
                  setTimeout(() => {
                    setIsThinking(false);
                    const rand = Math.floor(Math.random() * botQuotes.length);
                    setQuoteIdx(rand);
                  }, 1400);
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

      {/* 2. Unified Mascot Body Container (Floating head only) */}
      <motion.div
        ref={botRef}
        animate={isHovered ? "hover" : "idle"}
        variants={containerVariants}
        className="w-[90px] h-[90px] md:w-[130px] md:h-[130px] cursor-pointer pointer-events-auto filter drop-shadow-[0_0_15px_rgba(142,229,63,0.35)] active:scale-95 transition-all"
        title="SecBot AI Assistant - Click to query"
        onClick={handleMascotClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
          <defs>
            {/* Simple White Eye Glow */}
            <filter id="simpleEyeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Ambient Shadow */}
            <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Soft Shadow Underneath */}
          <ellipse
            cx="100"
            cy="175"
            rx="45"
            ry="7"
            fill="rgba(0, 0, 0, 0.2)"
            filter="url(#shadowGlow)"
          />

          {/* Mascot Head Logo Group */}
          <g>
            {/* The Green Silhouette Head with thick black outline */}
            <path
              d="M 100 160 
                 C 65 160, 40 145, 30 115 
                 C 20 85, 45 45, 95 30 
                 C 115 25, 125 35, 140 30 
                 C 150 25, 165 18, 172 26 
                 C 176 30, 178 38, 172 42 
                 C 168 45, 162 40, 164 34 
                 C 155 35, 140 45, 132 58 
                 C 145 80, 160 115, 155 135 
                 C 150 150, 135 160, 100 160 Z"
              fill="#8EE53F"
              stroke="#111111"
              strokeWidth="5"
              strokeLinejoin="round"
            />

            {/* Matte Black Face Opening */}
            <path
              d="M 68 125 
                 C 52 110, 52 82, 68 68 
                 C 80 54, 120 54, 132 68 
                 C 148 82, 148 110, 132 125 
                 C 118 135, 82 135, 68 125 Z"
              fill="#111111"
              stroke="#111111"
              strokeWidth="2"
            />

            {/* Eyes (Simple white vertical rounded ovals) */}
            <g>
              <motion.g
                animate={isListening ? { opacity: [1, 0.85, 1, 0.9, 1] } : { opacity: 1 }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                {isBlinking ? (
                  <>
                    <path d="M 81 96 Q 86 98 91 96" stroke="#FFFFFF" strokeWidth="3.0" strokeLinecap="round" fill="none" />
                    <path d="M 109 96 Q 114 98 119 96" stroke="#FFFFFF" strokeWidth="3.0" strokeLinecap="round" fill="none" />
                  </>
                ) : (
                  <>
                    <ellipse 
                      cx={86 + activeEyeOffset.x} 
                      cy={96 + activeEyeOffset.y} 
                      rx="6.5" 
                      ry="11.5" 
                      fill="#FFFFFF" 
                      filter="url(#simpleEyeGlow)" 
                    />
                    <ellipse 
                      cx={114 + activeEyeOffset.x} 
                      cy={96 + activeEyeOffset.y} 
                      rx="6.5" 
                      ry="11.5" 
                      fill="#FFFFFF" 
                      filter="url(#simpleEyeGlow)" 
                    />
                  </>
                )}
              </motion.g>
            </g>
          </g>

          {/* THINKING STATE: Rotating dashed eye rings */}
          {isThinking && (
            <>
              {/* Dotted target rings around eyes */}
              <motion.circle
                cx="86" cy="96" r="15"
                stroke="#8EE53F" strokeWidth="1.2" strokeDasharray="3 3" fill="none"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                style={{ originX: '86px', originY: '96px' }}
                opacity="0.85"
              />
              <motion.circle
                cx="114" cy="96" r="15"
                stroke="#8EE53F" strokeWidth="1.2" strokeDasharray="3 3" fill="none"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                style={{ originX: '114px', originY: '96px' }}
                opacity="0.85"
              />
            </>
          )}

          {/* LISTENING STATE: Floating packet particles */}
          {isListening && (
            <g className="pointer-events-none">
              <motion.circle cx="36" cy="110" r="1.8" fill="#8EE53F" animate={{ y: [-15, -65], opacity: [0, 0.9, 0] }} transition={{ repeat: Infinity, duration: 2.4, delay: 0 }} />
              <motion.circle cx="164" cy="115" r="2.2" fill="#8EE53F" animate={{ y: [-10, -75], opacity: [0, 0.9, 0] }} transition={{ repeat: Infinity, duration: 2.8, delay: 0.6 }} />
              <motion.circle cx="48" cy="48" r="1.5" fill="#8EE53F" animate={{ y: [-5, -45], opacity: [0, 0.8, 0] }} transition={{ repeat: Infinity, duration: 2.0, delay: 1.2 }} />
              <motion.circle cx="152" cy="58" r="2.0" fill="#8EE53F" animate={{ y: [-8, -58], opacity: [0, 0.9, 0] }} transition={{ repeat: Infinity, duration: 2.6, delay: 1.8 }} />
            </g>
          )}
        </svg>
      </motion.div>

    </div>
  );
};

export default CyberBot;
