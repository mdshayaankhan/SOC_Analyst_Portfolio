import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Sparkles, ChevronRight } from 'lucide-react';

const botQuotes = [
  "Welcome! I am MD-Agent, your cybersecurity companion.",
  "All systems operational. Network grid looks clear.",
  "Tip: You can query log summaries in the shell interface.",
  "Intrusion status: 0 active threats detected. System is safe.",
  "Want to explore? Use the buttons in my status bubble!",
  "Certificates decrypted! Scroll to Node 07 to view them.",
  "Wazuh telemetry feed: Ingesting logs successfully."
];

const quoteActions = [
  { label: 'EXPLORE PROJECTS', target: 'projects' },
  { label: 'RUN VULNERABILITY SCAN', target: 'scanner' },
  { label: 'LAUNCH TERMINAL', action: 'terminal' },
  { label: 'SIMULATE MITRE ATTACK', action: 'simulator' },
  { label: 'SCROLL TO CORE PROFILE', target: 'origin' },
  { label: 'DECRYPT CERTIFICATES', target: 'certs' },
  { label: 'MONITOR LOG TELESCOPE', target: 'soc-lab' }
];

const CyberBot = ({ isTerminalOpen, onToggleTerminal, onSimulateAttack }) => {
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

  // Periodic looking around when idle (only when mouse hasn't moved yet)
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

  // Track cursor offsets relative to the bot center (scaled to 64x64 coord space)
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

      const maxDisplacement = 2.5; // Larger displacement for visible tracking
      if (dist > 0) {
        const factor = Math.min(maxDisplacement, dist * 0.01);
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

  const activeEyeOffset = hasMouseMoved
    ? mouseOffset
    : eyeLookOffset;

  return (
    <div className="fixed bottom-4 right-4 z-40 font-mono flex items-end gap-3.5 pointer-events-none select-none max-w-[calc(100vw-2rem)] lg:bottom-8 lg:right-8 lg:flex-row flex-col-reverse justify-end items-center lg:items-end">

      {/* 1. Holographic Speech/Task Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 20, y: 15 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 20, y: 15 }}
            className="glassmorphism p-3.5 rounded-xl border border-google-red/45 text-left w-60 sm:w-64 shadow-2xl pointer-events-auto bg-cyber-bg-darker/95 relative mb-4 lg:mb-0 lg:mr-4"
          >
            {/* Responsive pointing arrow: points right on desktop, down on mobile */}
            <div
              className="absolute lg:top-1/2 lg:-right-1.5 lg:-translate-y-1/2 lg:left-auto lg:bottom-auto lg:border-r lg:border-t lg:border-l-0 lg:border-b-0 left-1/2 -bottom-1.5 -translate-x-1/2 top-auto right-auto border-r border-b border-t-0 border-l-0 w-2.5 h-2.5 transform rotate-45"
              style={{ backgroundColor: 'var(--cyber-bg-darker)' }}
            />

            <div className="flex items-center justify-between border-b border-cyber-bg-gray pb-1.5 mb-2 text-[9px] text-google-red font-bold">
              <div className="flex items-center gap-1.5">
                <Shield size={11} className="animate-pulse text-google-red" />
                <span>AGENT COGNITIVE GRID</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-google-red animate-ping" />
            </div>

            <p className="text-[10px] text-cyber-text-light font-sans leading-relaxed font-light mb-3 min-h-[30px]">
              {isThinking ? "Processing network vector node..." : botQuotes[quoteIdx]}
            </p>

            <div className="flex flex-col gap-1.5 pt-2 border-t border-cyber-bg-gray/40">
              {quoteActions[quoteIdx] && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const action = quoteActions[quoteIdx];
                    if (action.target) {
                      const el = document.getElementById(action.target);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    } else if (action.action === 'terminal') {
                      onToggleTerminal();
                    } else if (action.action === 'simulator') {
                      onSimulateAttack?.();
                    }
                  }}
                  className="w-full text-left py-1.5 px-2 rounded border border-google-green/40 bg-google-green/10 hover:bg-google-green/20 hover:border-google-green/60 text-google-green font-mono text-[9px] font-bold flex items-center justify-between cursor-pointer transition-all duration-200 hover:pl-3 active:scale-98"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={9} className="animate-pulse" />
                    <span>SUGGESTION: {quoteActions[quoteIdx].label}</span>
                  </span>
                  <ChevronRight size={10} />
                </button>
              )}

              <button
                onClick={() => {
                  onToggleTerminal();
                  setShowBubble(false);
                }}
                className="w-full text-left py-1 px-2 rounded border border-google-blue/40 bg-google-blue/5 hover:bg-google-blue/15 text-google-blue hover:text-cyber-text-white transition-all duration-200 hover:pl-3 active:scale-98 text-[9px] font-bold flex items-center justify-between cursor-pointer"
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
                className="w-full text-left py-1 px-2 rounded border border-cyber-bg-gray bg-cyber-bg-gray/20 hover:bg-cyber-bg-gray/40 text-cyber-text-muted hover:text-cyber-text-light transition-all duration-200 hover:pl-3 active:scale-98 text-[9px] flex items-center justify-between cursor-pointer"
              >
                <span>NEXT STATUS BLOCK</span>
                <Sparkles size={8} className="text-google-yellow" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Unified Mascot Body Container (Nested float/breathe wrappers, styled with CSS animations) */}
      <div className="agent-float-wrapper pointer-events-auto">
        <div className="agent-breathe-wrapper">
          <div
            ref={botRef}
            id="agent"
            className={`cursor-pointer filter drop-shadow-[0_0_15px_rgba(234,67,53,0.35)] active:scale-95 transition-all duration-300 ${isThinking ? 'talking' : ''}`}
            title="Agent AI Assistant - Click to query"
            onClick={handleMascotClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
              <defs>
                {/* Simple White Eye Glow */}
                <filter id="simpleEyeGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="0.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Ambient Shadow */}
                <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Soft Shadow Underneath (moved lower to cy="60" for more float gap) */}
              <ellipse
                cx="32"
                cy="60"
                rx="14"
                ry="1.5"
                fill="rgba(0, 0, 0, 0.4)"
                filter="url(#shadowGlow)"
              />

              {/* Mascot Head Logo Group */}
              <g>
                {/* Scaled-down Outer Body Group (Outline + Fill) */}
                <g transform="translate(32, 32) scale(0.90) translate(-32, -32)">
                  {/* Outer Silhouette (Outline) */}
                  <path
                    d="M 60 10 L 58 12 L 54 8 L 50 9 L 47 15 L 44 14 L 37 10 L 31 10 L 27 12 L 17 22 L 12 29 L 7 39 L 6 42 L 6 44 L 8 48 L 10 50 L 12 51 L 22 53 L 37 53 L 42 52 L 48 50 L 50 49 L 52 47 L 53 45 L 53 41 L 52 38 L 50 35 L 50 33 L 48 31 L 46 28 L 46 26 L 47 24 L 52 19 L 53 16 L 58 16 L 60 14 Z"
                    fill="#070909"
                  />

                  {/* Google Red Body */}
                  <path
                    d="M 58 13 L 56 13 L 52 10 L 51 13 L 47 17 L 45 17 L 41 15 L 39 13 L 37 12 L 31 12 L 26 15 L 18 24 L 13 31 L 8 41 L 8 44 L 9 46 L 11 48 L 15 50 L 18 51 L 24 52 L 35 52 L 41 51 L 44 50 L 48 48 L 50 46 L 51 44 L 51 41 L 50 38 L 49 36 L 47 34 L 44 27 L 42 25 L 40 20 L 39 16 L 43 20 L 45 21 L 48 21 L 50 19 L 51 16 L 51 14 L 53 12 L 55 14 Z"
                    fill="#EA4335"
                  />
                </g>

                {/* Matte Black Face Opening (Clean Oval shifted to left by 3px) */}
                <ellipse
                  cx="29.5"
                  cy="38"
                  rx="15.5"
                  ry="12"
                  fill="#070909"
                />

                {/* Eyes (Shifted left by 3px) */}
                <g>
                  {isBlinking ? (
                    <>
                      <ellipse
                        cx={23.5 + activeEyeOffset.x}
                        cy={38 + activeEyeOffset.y}
                        rx="2.5"
                        ry="0.5"
                        fill="#FFFFFF"
                      />
                      <ellipse
                        cx={36.0 + activeEyeOffset.x}
                        cy={38 + activeEyeOffset.y}
                        rx="2.5"
                        ry="0.5"
                        fill="#FFFFFF"
                      />
                    </>
                  ) : (
                    <>
                      <ellipse
                        cx={23.5 + activeEyeOffset.x}
                        cy={38 + activeEyeOffset.y}
                        rx="2.5"
                        ry="4"
                        fill="#FFFFFF"
                        filter="url(#simpleEyeGlow)"
                      />
                      <ellipse
                        cx={36.0 + activeEyeOffset.x}
                        cy={38 + activeEyeOffset.y}
                        rx="2.5"
                        ry="4"
                        fill="#FFFFFF"
                        filter="url(#simpleEyeGlow)"
                      />
                    </>
                  )}
                </g>
              </g>

              {/* THINKING STATE: Rotating dashed eye rings that follow eye-gaze tracking */}
              {isThinking && (
                <>
                  <motion.circle
                    cx={23.5 + activeEyeOffset.x}
                    cy={38 + activeEyeOffset.y}
                    r="5.5"
                    stroke="#EA4335" strokeWidth="0.5" strokeDasharray="1.5 1.5" fill="none"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                    style={{ 
                      originX: `${23.5 + activeEyeOffset.x}px`, 
                      originY: `${38 + activeEyeOffset.y}px` 
                    }}
                    opacity="0.85"
                  />
                  <motion.circle
                    cx={36.0 + activeEyeOffset.x}
                    cy={38 + activeEyeOffset.y}
                    r="5.5"
                    stroke="#EA4335" strokeWidth="0.5" strokeDasharray="1.5 1.5" fill="none"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                    style={{ 
                      originX: `${36.0 + activeEyeOffset.x}px`, 
                      originY: `${38 + activeEyeOffset.y}px` 
                    }}
                    opacity="0.85"
                  />
                </>
              )}

              {/* LISTENING STATE: Floating packet particles (Google Red) */}
              {isListening && (
                <g className="pointer-events-none">
                  <motion.circle cx="10" cy="38" r="0.8" fill="#EA4335" animate={{ y: [-5, -20], opacity: [0, 0.9, 0] }} transition={{ repeat: Infinity, duration: 2.4, delay: 0 }} />
                  <motion.circle cx="54" cy="40" r="1.0" fill="#EA4335" animate={{ y: [-3, -25], opacity: [0, 0.9, 0] }} transition={{ repeat: Infinity, duration: 2.8, delay: 0.6 }} />
                  <motion.circle cx="16" cy="16" r="0.6" fill="#EA4335" animate={{ y: [-2, -15], opacity: [0, 0.8, 0] }} transition={{ repeat: Infinity, duration: 2.0, delay: 1.2 }} />
                  <motion.circle cx="48" cy="20" r="0.9" fill="#EA4335" animate={{ y: [-3, -18], opacity: [0, 0.9, 0] }} transition={{ repeat: Infinity, duration: 2.6, delay: 1.8 }} />
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
