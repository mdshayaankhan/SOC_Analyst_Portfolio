import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Radio, Terminal, Award, Cpu, BookOpen, Target, Network, Folder } from 'lucide-react';

const nodes = [
  { id: 'origin', label: '01. Origin', title: 'Origin', icon: Shield, color: '#4285F4' },
  { id: 'learning', label: '02. Learning', title: 'Learning Cyber', icon: BookOpen, color: '#34A853' },
  { id: 'skills', label: '03. Skills', title: 'Skills Matrix', icon: Cpu, color: '#FBBC05' },
  { id: 'projects', label: '04. Projects', title: 'Projects Vault', icon: Folder, color: '#EA4335' },
  { id: 'soc-lab', label: '05. SOC Lab', title: 'SOC Home Lab', icon: Terminal, color: '#4285F4' },
  { id: 'scanner', label: '06. Scanner', title: 'Vuln Scanner', icon: Radio, color: '#34A853' },
  { id: 'certs', label: '07. Certs', title: 'Credentials', icon: Shield, color: '#FBBC05' },
  { id: 'achievements', label: '08. Achievements', title: 'Achievements', icon: Award, color: '#EA4335' },
  { id: 'mission', label: '09. Mission', title: 'Future Mission', icon: Target, color: '#4285F4' },
];

const CyberMapHUD = () => {
  const [activeSection, setActiveSection] = useState('origin');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (const node of nodes) {
        const el = document.getElementById(node.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(node.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <>
      {/* Desktop HUD Panel (Visible on large screens >= 1024px) */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center">
        <div className="glassmorphism px-3 py-1.5 rounded-t-lg border-b-0 w-full text-center mb-1">
          <span className="font-mono text-[9px] tracking-widest text-google-blue font-bold uppercase animate-pulse">
            Journey Node Map
          </span>
        </div>

        {/* HUD Box */}
        <div className="glassmorphism px-4 py-6 rounded-b-lg flex flex-col items-center relative gap-5.5 w-36">
          {/* Vertical Grid Line */}
          <div className="absolute top-8 bottom-8 left-[26px] w-[2px] bg-cyber-bg-gray overflow-hidden">
            <div
              className="w-full bg-gradient-to-b from-google-blue via-google-green to-google-red transition-all duration-300"
              style={{ height: `${scrollProgress}%` }}
            />
          </div>

          {nodes.map((node) => {
            const Icon = node.icon;
            const isActive = activeSection === node.id;
            return (
              <button
                key={node.id}
                onClick={() => scrollToSection(node.id)}
                className="flex items-center gap-3 w-full group relative focus:outline-none z-10 cursor-pointer"
                title={node.title}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 border ${
                    isActive
                      ? 'bg-cyber-bg-darker scale-110 shadow-lg'
                      : 'bg-cyber-bg-darkest hover:bg-cyber-bg-gray'
                  }`}
                  style={{
                    borderColor: isActive ? node.color : 'var(--glass-border)',
                    boxShadow: isActive ? `0 0 12px ${node.color}` : 'none',
                  }}
                >
                  <Icon
                    size={11}
                    style={{ color: isActive ? node.color : '#94A3B8' }}
                    className={isActive ? 'animate-pulse' : 'group-hover:text-cyber-text-white'}
                  />
                </div>

                <div className="flex flex-col items-start">
                  <span
                    className={`font-mono text-[9px] tracking-wider transition-all duration-300 ${
                      isActive ? 'text-cyber-text-white font-bold' : 'text-cyber-text-muted group-hover:text-cyber-text-light'
                    }`}
                  >
                    {node.label}
                  </span>
                  <span
                    className={`text-[8px] font-sans transition-all duration-300 truncate max-w-[70px] ${
                      isActive ? 'text-google-blue font-bold' : 'text-cyber-text-muted opacity-0 group-hover:opacity-100'
                    }`}
                    style={{ color: isActive ? node.color : undefined }}
                  >
                    {node.title}
                  </span>
                </div>

                {isActive && (
                  <span
                    className="absolute left-[25px] w-1.5 h-1.5 rounded-full animate-ping pointer-events-none"
                    style={{ backgroundColor: node.color }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="glassmorphism px-3 py-1.5 rounded-lg border-t-0 w-full mt-2 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-google-green animate-ping" />
            <span className="font-mono text-[8px] text-google-green font-semibold">
              MAP SECURE
            </span>
          </div>
        </div>
      </div>

      {/* Mobile HUD Trigger (Hidden on screens >= 1024px) */}
      <div className="fixed bottom-4 right-4 z-40 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full glassmorphism-blue flex items-center justify-center text-google-blue cursor-pointer shadow-xl focus:outline-none"
        >
          <Network size={22} className={isOpen ? 'rotate-90 transition-transform duration-300' : 'transition-transform duration-300'} />
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-14 right-0 glassmorphism-blue p-4 rounded-xl flex flex-col gap-2 w-48 shadow-2xl"
          >
            <div className="font-mono text-[10px] text-google-blue border-b border-cyber-bg-gray pb-1.5 font-bold uppercase tracking-wider">
              ROADMAP JOURNEY
            </div>
            {nodes.map((node) => {
              const Icon = node.icon;
              const isActive = activeSection === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => {
                    scrollToSection(node.id);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 w-full text-left py-1 hover:bg-cyber-bg-gray/40 px-2 rounded-lg cursor-pointer"
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center border"
                    style={{
                      borderColor: isActive ? node.color : 'var(--glass-border)',
                      backgroundColor: isActive ? 'rgba(0,0,0,0.3)' : 'transparent',
                    }}
                  >
                    <Icon size={10} style={{ color: isActive ? node.color : '#94A3B8' }} />
                  </div>
                  <span className={`font-mono text-[10px] ${isActive ? 'text-cyber-text-white font-bold' : 'text-cyber-text-muted'}`}>
                    {node.title}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default CyberMapHUD;
