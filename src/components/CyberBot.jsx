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
  const [isSpeaking, setIsSpeaking] = useState(false);
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

  // Speaking state trigger whenever quote changes
  useEffect(() => {
    setIsSpeaking(true);
    const timer = setTimeout(() => {
      setIsSpeaking(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [quoteIdx]);

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
        // Look left
        setEyeLookOffset({ x: -3, y: 0 });
        setTimeout(() => setEyeLookOffset({ x: 0, y: 0 }), 1400);
      } else if (rand < 0.5) {
        // Look right
        setEyeLookOffset({ x: 3, y: 0 });
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

      const maxDisplacement = 4.5;
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

  // Unified Floating container variants (Head and Cloak stay connected, no gap!)
  const containerVariants = {
    idle: {
      y: [0, -10, 0],
      transition: { repeat: Infinity, duration: 4.8, ease: "easeInOut" }
    },
    hover: {
      y: [0, -8, 0],
      scale: 1.05,
      transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
    }
  };

  // Cloak swaying behavior (wind/air simulation, only horizontal skew/rotate to keep connection!)
  const cloakVariants = {
    idle: {
      rotate: [-1.2, 1.2, -1.2],
      skewX: [-1.5, 1.5, -1.5],
      transition: { repeat: Infinity, duration: 3.2, ease: "easeInOut" }
    },
    thinking: {
      rotate: [-0.4, 0.4, -0.4],
      skewX: [-0.6, 0.6, -0.6],
      transition: { repeat: Infinity, duration: 4.5, ease: "easeInOut" }
    },
    hover: {
      rotate: [-2.2, 2.2, -2.2],
      skewX: [-3, 3, -3],
      transition: { repeat: Infinity, duration: 1.6, ease: "easeInOut" }
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

      {/* 2. Unified Mascot Body Container (Ensures head and body float together - no gap!) */}
      <motion.div
        ref={botRef}
        animate={isHovered ? "hover" : isThinking ? "thinking" : "idle"}
        variants={containerVariants}
        className="w-[100px] h-[100px] md:w-[155px] md:h-[155px] cursor-pointer pointer-events-auto filter drop-shadow-[0_0_15px_rgba(234,67,53,0.5)] active:scale-95 transition-all"
        title="SecBot AI Assistant - Click to query"
        onClick={handleMascotClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
          <defs>
            {/* Glossy Red Gradient */}
            <linearGradient id="hoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff5847" />
              <stop offset="50%" stopColor="#EA4335" />
              <stop offset="100%" stopColor="#9e1a10" />
            </linearGradient>

            {/* Dark Face Panel Gradient */}
            <linearGradient id="faceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E2026" />
              <stop offset="100%" stopColor="#0B0C0E" />
            </linearGradient>

            {/* Cyan Eye Glow Filter */}
            <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Ambient Cloak Glow Filter */}
            <filter id="cloakGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Orbit Glows */}
            <filter id="orbitGlowBlue" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
          </defs>

          {/* LISTENING/HOVER STATE: Ambient Under-Glow */}
          <AnimatePresence>
            {(isListening || isHovered || isThinking) && (
              <motion.ellipse
                cx="100"
                cy="148"
                rx="68"
                ry="36"
                fill="rgba(234, 67, 53, 0.22)"
                filter="url(#cloakGlow)"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
              />
            )}
          </AnimatePresence>

          {/* LAYER 1: Feet (Positioned directly under cloak rolls) */}
          <g>
            <ellipse cx="80" cy="180" rx="14" ry="5" fill="#111111" />
            <ellipse cx="120" cy="180" rx="14" ry="5" fill="#111111" />
          </g>

          {/* LAYER 2: Wrapped Pleated Cloak (Air Wind Swaying Animation) */}
          <motion.g
            animate={isThinking ? "thinking" : isHovered ? "hover" : "idle"}
            variants={cloakVariants}
            style={{ originX: 0.5, originY: 0.51 }}
          >
            {/* Main Cloak Contour Path - Bell Silhouette */}
            <path
              d="M 62 102 
                 C 62 102, 35 130, 35 174 
                 C 35 178, 45 178, 50 178 
                 C 65 178, 75 178, 100 178 
                 C 125 178, 135 178, 150 178 
                 C 155 178, 165 178, 165 174 
                 C 165 130, 138 102, 138 102 Z"
              fill="url(#hoodGrad)"
              stroke="#EA4335"
              strokeWidth="0.8"
            />

            {/* 3D Vertical Pleats/Creases matching the second image */}
            <path d="M 68 102 C 60 125, 56 148, 58 172" stroke="#7a120a" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.85" />
            <path d="M 84 102 C 78 128, 72 152, 70 174" stroke="#8c140b" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.85" />
            <path d="M 91 102 C 86 128, 83 152, 84 176" stroke="#7a120a" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.85" />
            <path d="M 109 102 C 114 128, 117 152, 116 176" stroke="#7a120a" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.85" />
            <path d="M 130 102 C 122 128, 128 152, 130 174" stroke="#8c140b" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.85" />
            <path d="M 142 102 C 140 125, 144 148, 142 172" stroke="#7a120a" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.85" />

            {/* Bottom cylinder rolled openings for premium 3D edge finish */}
            <ellipse cx="46.5" cy="174" rx="11" ry="4.5" fill="#600b05" />
            <ellipse cx="70" cy="176" rx="12" ry="5" fill="#600b05" />
            <ellipse cx="91" cy="178" rx="12.5" ry="5.5" fill="#600b05" />
            <ellipse cx="109" cy="178" rx="12.5" ry="5.5" fill="#600b05" />
            <ellipse cx="130" cy="176" rx="12" ry="5" fill="#600b05" />
            <ellipse cx="153.5" cy="174" rx="11" ry="4.5" fill="#600b05" />

            {/* Glossy Highlights on pleat ridges */}
            <path d="M 52 118 C 46 134, 40 148, 44 162" stroke="#ffa399" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.25" />
            <path d="M 74 116 C 70 134, 66 148, 68 164" stroke="#ffa399" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.25" />
            <path d="M 93 114 C 91 134, 88 148, 90 166" stroke="#ffa399" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.25" />
            <path d="M 117 114 C 119 134, 122 148, 120 166" stroke="#ffa399" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.25" />

            {/* Green Status Indicator Button on the bottom-right pleat */}
            <g transform="translate(150, 154)">
              <circle cx="0" cy="0" r="7.5" fill="#1A1D24" stroke="#600b05" strokeWidth="1.5" />
              <motion.circle 
                cx="0" 
                cy="0" 
                r="4.2" 
                fill="#34A853" 
                animate={isListening ? { scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] } : { opacity: 0.95 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              />
              <circle cx="-1.5" cy="-1.5" r="1.2" fill="#ffffff" opacity="0.7" />
            </g>
          </motion.g>

          {/* LAYER 3: Hood with glossy outer rim & wizard tail */}
          <g>
            {/* Hood Base Outline (Round with curved tail to top-right) */}
            <path
              d="M 60 102 
                 C 32 102, 32 72, 32 50 
                 C 32 26, 56 16, 100 16 
                 C 118 16, 130 22, 142 22 
                 C 155 22, 165 14, 165 25 
                 C 165 34, 158 38, 152 38 
                 C 146 38, 144 32, 150 28 
                 C 154 26, 154 28, 150 30 
                 C 144 32, 132 38, 130 48 
                 C 138 56, 148 72, 148 102 Z"
              fill="url(#hoodGrad)"
              stroke="#EA4335"
              strokeWidth="0.8"
            />

            {/* Double-layered Collar Rim (Thick edge around the face opening) */}
            <ellipse cx="100" cy="68" rx="35" ry="30" fill="none" stroke="#7a120a" strokeWidth="5.5" />
            <ellipse cx="100" cy="68" rx="35" ry="30" fill="none" stroke="url(#hoodGrad)" strokeWidth="3" />
            <ellipse cx="100" cy="68" rx="35" ry="30" fill="none" stroke="#ffa399" strokeWidth="1.2" opacity="0.3" />

            {/* Dark Screen Face */}
            <ellipse
              cx="100"
              cy="68"
              rx="28"
              ry="23"
              fill="url(#faceGrad)"
              stroke="rgba(234, 67, 53, 0.4)"
              strokeWidth="1.5"
            />

            {/* Face details group (Eyes and Mouth) */}
            <g>
              {/* Eyes Container */}
              <motion.g
                animate={isSpeaking ? { opacity: [1, 0.85, 1, 0.9, 1] } : { opacity: 1 }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                {isBlinking ? (
                  <>
                    {/* Blink: Curved closed eyes lines */}
                    <path d="M 76 68 Q 84 71 92 68" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                    <path d="M 108 68 Q 116 71 124 68" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  </>
                ) : (
                  <>
                    {/* Glowing White Eyes with Cyan/Blue Inner Glow */}
                    <ellipse 
                      cx={84 + activeEyeOffset.x} 
                      cy={68 + activeEyeOffset.y} 
                      rx="8" 
                      ry="12" 
                      fill="#FFFFFF" 
                      filter="url(#cyanGlow)" 
                    />
                    <ellipse 
                      cx={116 + activeEyeOffset.x} 
                      cy={68 + activeEyeOffset.y} 
                      rx="8" 
                      ry="12" 
                      fill="#FFFFFF" 
                      filter="url(#cyanGlow)" 
                    />
                    
                    {/* Soft cyan inner glow stroke */}
                    <ellipse cx={84 + activeEyeOffset.x} cy={68 + activeEyeOffset.y} rx="5.5" ry="9.2" fill="none" stroke="#4285F4" strokeWidth="1.2" opacity="0.45" />
                    <ellipse cx={116 + activeEyeOffset.x} cy={68 + activeEyeOffset.y} rx="5.5" ry="9.2" fill="none" stroke="#4285F4" strokeWidth="1.2" opacity="0.45" />
                    
                    {/* Highlight Sparkles */}
                    <circle cx={81.5 + activeEyeOffset.x} cy="64.5" r="1.5" fill="#FFFFFF" />
                    <circle cx="113.5" cy="64.5" r="1.5" fill="#FFFFFF" />
                  </>
                )}
              </motion.g>

              {/* Tiny Smile Mouth */}
              <path 
                d={isSpeaking 
                  ? "M 96 78 Q 100 81 104 78" 
                  : isHovered 
                    ? "M 95 78 Q 100 81.5 105 78" 
                    : "M 96 79 Q 100 81.5 104 79"} 
                stroke="#FFFFFF" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                fill="none" 
              />
            </g>

            {/* Glossy highlight line on hood curve */}
            <path
              d="M 44 42 C 48 30, 68 25, 84 25"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.25"
            />
          </g>

          {/* THINKING STATE: Rotating dashed eye rings & Orbiting dots */}
          {isThinking && (
            <>
              {/* Dotted target rings around eyes */}
              <motion.circle
                cx="84" cy="68" r="16.5"
                stroke="#4285F4" strokeWidth="1.5" strokeDasharray="3 3" fill="none"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                style={{ originX: '84px', originY: '68px' }}
                opacity="0.8"
              />
              <motion.circle
                cx="116" cy="68" r="16.5"
                stroke="#4285F4" strokeWidth="1.5" strokeDasharray="3 3" fill="none"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                style={{ originX: '116px', originY: '68px' }}
                opacity="0.8"
              />

              {/* Orbiting Multi-colored dots */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                style={{ originX: '100px', originY: '68px' }}
              >
                <circle cx="100" cy="12" r="3.2" fill="#34A853" filter="url(#orbitGlowBlue)" />
                <circle cx="44" cy="68" r="3.2" fill="#4285F4" filter="url(#orbitGlowBlue)" />
                <circle cx="156" cy="68" r="3.2" fill="#FBBC05" filter="url(#orbitGlowBlue)" />
              </motion.g>
            </>
          )}

          {/* LISTENING STATE: Sparkles / floating packet particles */}
          {isListening && (
            <g className="pointer-events-none">
              <motion.circle cx="36" cy="110" r="1.8" fill="#EA4335" animate={{ y: [-15, -65], opacity: [0, 0.9, 0] }} transition={{ repeat: Infinity, duration: 2.4, delay: 0 }} />
              <motion.circle cx="164" cy="115" r="2.2" fill="#34A853" animate={{ y: [-10, -75], opacity: [0, 0.9, 0] }} transition={{ repeat: Infinity, duration: 2.8, delay: 0.6 }} />
              <motion.circle cx="48" cy="48" r="1.5" fill="#FBBC05" animate={{ y: [-5, -45], opacity: [0, 0.8, 0] }} transition={{ repeat: Infinity, duration: 2.0, delay: 1.2 }} />
              <motion.circle cx="152" cy="58" r="2.0" fill="#4285F4" animate={{ y: [-8, -58], opacity: [0, 0.9, 0] }} transition={{ repeat: Infinity, duration: 2.6, delay: 1.8 }} />
            </g>
          )}
        </svg>
      </motion.div>

    </div>
  );
};

export default CyberBot;
