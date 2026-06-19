import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Sparkles, ChevronRight, Play, Award, Cpu, Folder, Lock } from 'lucide-react';

const botQuotes = [
  "👋 Hello! I am MD-Agent, your security companion. Let's audit this workspace!",
  "🛡️ Wazuh SIEM telemetry: Ingesting logs successfully. All systems operational.",
  "💡 Tip: You can query terminal commands like 'help' or 'skills' in my portal shell.",
  "🟢 Intrusion Status: 0 active threats detected. System integrity is stable.",
  "🚀 Want to navigate? Click the quick action commands in my cognitive grid!",
  "🔑 Certifications decrypted! Scroll down to inspect my verified vault."
];

const CyberBot = ({ isTerminalOpen, onToggleTerminal }) => {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [eyeLookOffset, setEyeLookOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [hasMouseMoved, setHasMouseMoved] = useState(false);
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

  // Periodic Cute Blinking (3000ms interval, 120ms duration)
  useEffect(() => {
    const blinkCycle = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 120);
    };

    const interval = setInterval(() => {
      blinkCycle();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Periodic looking around when idle
  useEffect(() => {
    const lookInterval = setInterval(() => {
      if (hasMouseMoved || isThinking) return;
      const rand = Math.random();
      if (rand < 0.25) {
        setEyeLookOffset({ x: -0.8, y: 0 });
        setTimeout(() => setEyeLookOffset({ x: 0, y: 0 }), 1400);
      } else if (rand < 0.5) {
        setEyeLookOffset({ x: 0.8, y: 0 });
        setTimeout(() => setEyeLookOffset({ x: 0, y: 0 }), 1400);
      }
    }, 7000);

    return () => clearInterval(lookInterval);
  }, [hasMouseMoved, isThinking]);

  // Track cursor offsets relative to the bot center
  useEffect(() => {
    const handleMouseMove = (e) => {
      setHasMouseMoved(true);
      if (!botRef.current) return;
      const rect = botRef.current.getBoundingClientRect();
      const botCenterX = rect.left + rect.width / 2;
      const botCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - botCenterX;
      const dy = e.clientY - botCenterY;
      const dist = Math.hypot(dx, dy);

      const maxDisplacement = 2.0; // Subtle eye tracking displacement
      if (dist > 0) {
        const factor = Math.min(maxDisplacement, dist * 0.008);
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
    } catch (err) { }

    // Toggle bubble open/closed state on click
    if (showBubble) {
      setShowBubble(false);
    } else {
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        const rand = Math.floor(Math.random() * botQuotes.length);
        setQuoteIdx(rand);
        setShowBubble(true);
      }, 1000);
    }
  };

  const handleAction = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeEyeOffset = hasMouseMoved ? mouseOffset : eyeLookOffset;

  return (
    <div className="fixed bottom-4 right-4 z-40 font-mono flex items-end gap-3.5 pointer-events-none select-none max-w-[calc(100vw-2rem)] lg:bottom-8 lg:right-8 lg:flex-row flex-col-reverse justify-end items-center lg:items-end">

      {/* 1. Holographic Speech/Task Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 20, y: 15 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 20, y: 15 }}
            className="glassmorphism p-3.5 rounded-xl border border-google-blue/45 text-left w-60 sm:w-64 shadow-2xl pointer-events-auto bg-cyber-bg-darker/95 relative mb-2"
          >
            <div
              className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 border-r border-t border-google-blue/45 transform rotate-45"
              style={{ backgroundColor: 'var(--cyber-bg-darker)' }}
            />

            <div className="flex items-center justify-between border-b border-cyber-bg-gray pb-1.5 mb-2 text-[9px] text-google-blue font-bold">
              <div className="flex items-center gap-1.5">
                <Shield size={11} className="animate-pulse text-google-blue" />
                <span>AGENT COGNITIVE GRID</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-google-blue animate-ping" />
            </div>

            <p className="text-[10px] text-cyber-text-light font-sans leading-relaxed font-light mb-3 min-h-[30px]">
              {isThinking ? "Processing network vector node..." : botQuotes[quoteIdx]}
            </p>

            <div className="flex flex-col gap-1.5 pt-2 border-t border-cyber-bg-gray/40">
              {/* Toggle secure shell */}
              <button
                onClick={() => {
                  onToggleTerminal();
                  setShowBubble(false);
                }}
                className="w-full text-left py-1.5 px-2 rounded border border-google-blue/40 bg-google-blue/5 hover:bg-google-blue/15 text-google-blue hover:text-white transition-all text-[9px] font-bold flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  <Terminal size={10} />
                  <span>{isTerminalOpen ? 'CLOSE SECURE SHELL' : 'LAUNCH SECURE SHELL'}</span>
                </span>
                <ChevronRight size={10} />
              </button>

              {/* Action grid */}
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                <button
                  onClick={() => {
                    handleAction('certs');
                    setIsThinking(true);
                    setTimeout(() => setIsThinking(false), 800);
                  }}
                  className="py-1 px-1.5 rounded border border-google-yellow/40 bg-google-yellow/5 hover:bg-google-yellow/15 text-google-yellow hover:text-white transition-all text-[8px] font-bold text-center cursor-pointer"
                >
                  🔓 DECRYPT VAULT
                </button>
                <button
                  onClick={() => {
                    handleAction('scanner');
                    setIsThinking(true);
                    setTimeout(() => setIsThinking(false), 800);
                  }}
                  className="py-1 px-1.5 rounded border border-google-green/40 bg-google-green/5 hover:bg-google-green/15 text-google-green hover:text-white transition-all text-[8px] font-bold text-center cursor-pointer"
                >
                  🔍 RUN SCANNER
                </button>
                <button
                  onClick={() => {
                    // Try to click simulation button on screen
                    const buttons = Array.from(document.querySelectorAll('button'));
                    const simBtn = buttons.find(b => b.textContent.includes('SIMULATE ATTACK'));
                    if (simBtn) {
                      simBtn.click();
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                    setIsThinking(true);
                    setTimeout(() => setIsThinking(false), 800);
                  }}
                  className="py-1 px-1.5 rounded border border-google-red/40 bg-google-red/5 hover:bg-google-red/15 text-google-red hover:text-white transition-all text-[8px] font-bold text-center cursor-pointer"
                >
                  💥 SIMULATE ATTACK
                </button>
                <button
                  onClick={() => {
                    handleAction('projects');
                    setIsThinking(true);
                    setTimeout(() => setIsThinking(false), 800);
                  }}
                  className="py-1 px-1.5 rounded border border-cyber-bg-gray bg-cyber-bg-gray/20 hover:bg-cyber-bg-gray/40 text-cyber-text-muted hover:text-cyber-text-light transition-all text-[8px] font-bold text-center cursor-pointer"
                >
                  📁 PROJECT VAULT
                </button>
              </div>

              {/* Next status indicator */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsThinking(true);
                  setTimeout(() => {
                    setIsThinking(false);
                    const rand = Math.floor(Math.random() * botQuotes.length);
                    setQuoteIdx(rand);
                  }, 1000);
                }}
                className="w-full mt-1 text-center py-1 px-2 rounded border border-cyber-bg-gray/40 bg-cyber-bg-gray/10 hover:bg-cyber-bg-gray/25 text-cyber-text-muted hover:text-cyber-text-light transition-all text-[8px] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>NEXT LOG SUMMARY</span>
                <Sparkles size={8} className="text-google-yellow" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Unified Mascot Body Container */}
      <div className="agent-float-wrapper pointer-events-auto">
        <div className="agent-breathe-wrapper">
          <div
            ref={botRef}
            id="agent"
            className={`w-16 h-16 cursor-pointer filter drop-shadow-[0_0_15px_rgba(56,189,248,0.35)] active:scale-95 transition-all duration-300 ${isThinking ? 'talking' : ''}`}
            title="Agent AI Assistant - Click to query"
            onClick={handleMascotClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
              <defs>
                {/* Visor Glow */}
                <filter id="visorGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                {/* Cyan LED Glow */}
                <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="1" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                {/* Visor Gradient */}
                <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                {/* Body Gradient */}
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
              </defs>

              {/* Soft Shadow Underneath */}
              <ellipse
                cx="32"
                cy="58"
                rx="16"
                ry="2"
                fill="rgba(0, 0, 0, 0.5)"
                filter="url(#visorGlow)"
              />

              {/* Cyber Antennae */}
              <line x1="18" y1="22" x2="10" y2="14" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="10" cy="14" r="2.5" fill="#38bdf8" className="animate-pulse" />

              <line x1="46" y1="22" x2="54" y2="14" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="54" cy="14" r="2.5" fill="#38bdf8" className="animate-pulse" />

              {/* Main Head Dome (Sleek Glassy Helmet) */}
              <circle cx="32" cy="32" r="20" fill="url(#bodyGrad)" stroke="#0f172a" strokeWidth="2" />
              
              {/* Shiny Helmet Highlight */}
              <path d="M 18,20 Q 32,14 46,20 Q 32,24 18,20 Z" fill="rgba(255, 255, 255, 0.25)" />

              {/* Cyber Visor Shield (Matte Black/Deep Blue, shifted left by 2.5px to turn face left) */}
              <rect x="13.5" y="24" width="32" height="15" rx="7.5" fill="url(#visorGrad)" stroke="#38bdf8" strokeWidth="1.5" filter="url(#visorGlow)" />

              {/* Visor Reflection Streak (shifted left by 2.5px) */}
              <path d="M 15.5,26 L 43.5,26 L 39.5,29 L 19.5,29 Z" fill="rgba(255, 255, 255, 0.12)" />

              {/* Cyber Mouth / LED Status Bar (shifted left by 2.5px) */}
              <rect x="23.5" y="44" width="12" height="2" rx="1" fill="#38bdf8" opacity="0.6" className="animate-pulse" />

              {/* Neon LED Eyes (shifted left by 2.5px to face left, plus interactive tracking) */}
              <g>
                {isBlinking ? (
                  <>
                    <line x1={18.5 + activeEyeOffset.x} y1="31.5" x2={24.5 + activeEyeOffset.x} y2="31.5" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1={34.5 + activeEyeOffset.x} y1="31.5" x2={40.5 + activeEyeOffset.x} y2="31.5" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                ) : isHovered ? (
                  <>
                    <path d="M 18.5,33 Q 21.5,29 24.5,33" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" filter="url(#cyanGlow)" />
                    <path d="M 34.5,33 Q 37.5,29 40.5,33" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" filter="url(#cyanGlow)" />
                  </>
                ) : (
                  <>
                    <circle cx={21.5 + activeEyeOffset.x} cy={31.5 + activeEyeOffset.y} r="2.5" fill="#38bdf8" filter="url(#cyanGlow)" />
                    <circle cx={37.5 + activeEyeOffset.x} cy={31.5 + activeEyeOffset.y} r="2.5" fill="#38bdf8" filter="url(#cyanGlow)" />
                  </>
                )}
              </g>

              {/* Thinking State: Rotating dashed eye rings (shifted left by 2.5px) */}
              {isThinking && (
                <>
                  <motion.circle
                    cx="21.5" cy="31.5" r="4.5"
                    stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="1 1" fill="none"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                    style={{ originX: '21.5px', originY: '31.5px' }}
                    opacity="0.85"
                  />
                  <motion.circle
                    cx="37.5" cy="31.5" r="4.5"
                    stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="1 1" fill="none"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                    style={{ originX: '37.5px', originY: '31.5px' }}
                    opacity="0.85"
                  />
                </>
              )}

              {/* Listening State: Floating packet particles (Cyan) */}
              {isListening && (
                <g className="pointer-events-none">
                  <motion.circle cx="10" cy="38" r="0.8" fill="#38bdf8" animate={{ y: [-5, -20], opacity: [0, 0.9, 0] }} transition={{ repeat: Infinity, duration: 2.4, delay: 0 }} />
                  <motion.circle cx="54" cy="40" r="1.0" fill="#38bdf8" animate={{ y: [-3, -25], opacity: [0, 0.9, 0] }} transition={{ repeat: Infinity, duration: 2.8, delay: 0.6 }} />
                  <motion.circle cx="16" cy="16" r="0.6" fill="#38bdf8" animate={{ y: [-2, -15], opacity: [0, 0.8, 0] }} transition={{ repeat: Infinity, duration: 2.0, delay: 1.2 }} />
                  <motion.circle cx="48" cy="20" r="0.9" fill="#38bdf8" animate={{ y: [-3, -18], opacity: [0, 0.9, 0] }} transition={{ repeat: Infinity, duration: 2.6, delay: 1.8 }} />
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CyberBot;
