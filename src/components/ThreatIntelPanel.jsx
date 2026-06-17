import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Activity, Radio, X } from 'lucide-react';

const ThreatIntelPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Simulated metrics that tick up slowly over time
  const [events, setEvents] = useState(1421656);
  const [alerts, setAlerts] = useState(4835);
  const [nodes, setNodes] = useState(86);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live traffic updates
      setEvents(prev => prev + Math.floor(Math.random() * 4) + 1);
      if (Math.random() > 0.85) {
        setAlerts(prev => prev + 1);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Collapse automatically on smaller/zoomed screens, but default open on very wide ones
  useEffect(() => {
    const checkViewport = () => {
      if (window.innerWidth >= 1350) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return (
    <div className="fixed right-6 top-6 z-40 font-mono">
      <AnimatePresence mode="wait">
        
        {/* COLLAPSED HUD TRIGGER BUTTON */}
        {!isOpen && (
          <motion.button
            key="collapsed-cti"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 rounded-full glassmorphism-blue flex flex-col items-center justify-center text-google-blue cursor-pointer shadow-xl border border-google-blue/40 relative hover:scale-105 active:scale-95 transition-all select-none"
            title="Expand CTI Telemetry Panel"
          >
            <Radio size={18} className="animate-pulse" />
            <span className="text-[7px] font-bold mt-0.5 tracking-tighter text-cyber-text-muted">CTI</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-google-green animate-ping" />
          </motion.button>
        )}

        {/* EXPANDED CTI METRICS PANEL */}
        {isOpen && (
          <motion.div
            key="expanded-cti"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            className="glassmorphism p-4 rounded-xl border border-cyber-bg-gray w-64 shadow-2xl relative text-left bg-cyber-bg-darker/95 max-w-[calc(100vw-2rem)] select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cyber-bg-gray pb-2 mb-3.5">
              <div className="flex items-center gap-1.5">
                <Activity size={14} className="text-google-blue animate-pulse" />
                <span className="text-[10px] font-bold text-cyber-text-white tracking-widest uppercase">
                  CTI PANEL V4.2
                </span>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="text-cyber-text-muted hover:text-google-red p-0.5 rounded transition-colors cursor-pointer"
                title="Collapse Panel"
              >
                <X size={13} />
              </button>
            </div>

            {/* Content Stats */}
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between items-center bg-cyber-bg-darkest/40 p-2 rounded border border-cyber-bg-gray/60">
                <span className="text-[10px] text-cyber-text-muted">THREAT LEVEL</span>
                <span className="font-bold text-google-green text-[10px] uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-google-green animate-pulse" />
                  STABLE
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-cyber-text-muted text-[10px]">SOC STATUS</span>
                <span className="text-google-blue font-bold text-[10px] uppercase">
                  OPERATIONAL
                </span>
              </div>

              <div className="h-[1px] bg-cyber-bg-gray/40 my-0.5" />

              <div className="flex justify-between">
                <span className="text-cyber-text-muted text-[10px]">Events Processed</span>
                <span className="text-cyber-text-white font-bold">{events.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-cyber-text-muted text-[10px]">Alerts Investigated</span>
                <span className="text-cyber-text-white font-bold">{alerts.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-cyber-text-muted text-[10px]">Nodes Monitored</span>
                <span className="text-cyber-text-white font-bold">{nodes}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-cyber-bg-gray pt-2.5 mt-3.5 flex items-center gap-1.5 text-[8px] text-google-yellow">
              <ShieldCheck size={10} className="text-google-yellow animate-pulse" />
              <span className="font-bold tracking-wider uppercase">
                SECURE HANDSHAKE: ESTABLISHED
              </span>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default ThreatIntelPanel;
