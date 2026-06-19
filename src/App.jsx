import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, ShieldCheck, Terminal as TerminalIcon, 
  ArrowDown, Mail, Download, User, Play, Award, 
  ChevronRight, Lock, Send, RefreshCw, Eye, Folder
} from 'lucide-react';

// Subcomponents
import ParticleNetwork from './components/ParticleNetwork';
import ThemeToggle from './components/ThemeToggle';
import CyberMapHUD from './components/CyberMapHUD';
import ThreatIntelPanel from './components/ThreatIntelPanel';
import InteractiveTerminal from './components/InteractiveTerminal';
import AttackSimulator from './components/AttackSimulator';
import SkillsRadar from './components/SkillsRadar';
import ProjectsVault from './components/ProjectsVault';
import LabLogFlow from './components/LabLogFlow';
import VulnerabilityScanner from './components/VulnerabilityScanner';
import CertificatesVault from './components/CertificatesVault';
import LockedMissions from './components/LockedMissions';
import CyberBot from './components/CyberBot';

const App = () => {
  const [showSimulator, setShowSimulator] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  
  // Typing animation for subtitle log cycle
  const [currentText, setCurrentText] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 70;
  const deletingSpeed = 40;
  const pauseDuration = 2200;

  const typingPhrases = [
    "Monitoring Logs...",
    "Analyzing Threats...",
    "Hunting Attackers...",
    "Investigating Incidents...",
    "Protecting Systems..."
  ];

  useEffect(() => {
    let timer;
    const fullPhrase = typingPhrases[textIdx];

    if (!isDeleting) {
      if (currentText.length < fullPhrase.length) {
        timer = setTimeout(() => {
          setCurrentText(fullPhrase.slice(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setTextIdx((prev) => (prev + 1) % typingPhrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, textIdx]);

  // Secure message form processing states
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle'); // idle, encrypting, securing, complete
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus('encrypting');
    
    setTimeout(() => {
      setFormStatus('securing');
      setTimeout(() => {
        setFormStatus('complete');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          setFormStatus('idle');
        }, 4000);
      }, 1500);
    }, 1500);
  };

  const handleScrollToJourney = () => {
    const el = document.getElementById('origin');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-cyber-bg-darkest text-cyber-text-light flex flex-col selection:bg-google-blue/30 selection:text-white">
      {/* 1. Background Particle System */}
      <ParticleNetwork />

      {/* 2. Floating Theme Selector Toggle Switch */}
      <ThemeToggle />

      {/* 3. Floating Command HUD Sidebar (Nodes 01-09) */}
      <CyberMapHUD />

      {/* 4. Floating CTI (Cyber Threat Intel) Live Panel */}
      <ThreatIntelPanel />

      {/* 5. Floating Command Line Terminal console */}
      <InteractiveTerminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />

      {/* 6. Floating Interactive Green Agent Helper Bot */}
      <CyberBot isTerminalOpen={isTerminalOpen} onToggleTerminal={() => setIsTerminalOpen(prev => !prev)} />

      {/* 7. Fullscreen Incident Response Attack Simulator */}
      <AnimatePresence>
        {showSimulator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <AttackSimulator onClose={() => setShowSimulator(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout Container (With padding-left to leave space for left HUD map on zoom) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8 lg:pl-36 xl:pl-20 2xl:pl-0 flex flex-col gap-28 pb-20">
        
        {/* ================= HERO SECTION ================= */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center relative pt-20 lg:-translate-x-16">
          
          {/* Subtle grid pattern background highlight */}
          <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

          {/* Animated visual telemetry map outline (represented as a pulsing grid radar) */}
          <div className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] border border-google-blue/10 rounded-full animate-pulse-slow pointer-events-none flex items-center justify-center">
            <div className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] border border-google-green/10 rounded-full flex items-center justify-center">
              <div className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] border border-google-red/10 rounded-full" />
            </div>
          </div>

          <span className="font-mono text-xs md:text-sm tracking-[0.25em] text-google-blue font-bold uppercase mb-4 animate-pulse">
            ★ SYSTEM CORE PROTOCOL INITIALIZED ★
          </span>

          <h1 className="font-orbitron font-black text-3xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl lg:whitespace-nowrap text-cyber-text-white tracking-tight uppercase leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            MOHAMMAD SHAYAAN KHAN
          </h1>

          {/* Core Roles Grid */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 mb-4 font-mono text-xs md:text-sm text-cyber-text-white font-bold">
            <span className="px-3 py-1 rounded bg-google-blue/10 border border-google-blue/30 text-google-blue shadow-lg shadow-google-blue/5">
              SOC ANALYST
            </span>
            <span className="text-cyber-text-muted/40 hidden sm:inline">|</span>
            <span className="px-3 py-1 rounded bg-google-green/10 border border-google-green/30 text-google-green shadow-lg shadow-google-green/5">
              THREAT HUNTER
            </span>
            <span className="text-cyber-text-muted/40 hidden sm:inline">|</span>
            <span className="px-3 py-1 rounded bg-google-red/10 border border-google-red/30 text-google-red shadow-lg shadow-google-red/5">
              DETECTION ENGINEER
            </span>
          </div>

          {/* Live Action Typing Simulator */}
          <div className="h-8 flex items-center justify-center mb-10">
            <div className="font-mono text-sm sm:text-base text-google-yellow font-bold bg-cyber-bg-darker/60 border border-cyber-bg-gray py-1 px-4 rounded-md flex items-center gap-2">
              <TerminalIcon size={14} className="text-google-yellow animate-pulse" />
              <span>{currentText}</span>
              <span className="w-1.5 h-4 bg-google-yellow animate-blink" />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 w-full max-w-lg mx-auto z-20">
            {/* Top row buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <button
                onClick={handleScrollToJourney}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-google-blue bg-google-blue/10 hover:bg-google-blue/20 text-cyber-text-white font-mono text-xs font-bold tracking-wider cursor-pointer transition-all duration-300 hover:scale-105"
              >
                LAUNCH CYBER JOURNEY
              </button>
              
              <button
                onClick={() => {
                  const el = document.getElementById('projects');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-cyber-bg-gray/60 bg-cyber-bg-darkest/45 hover:border-cyber-bg-gray text-cyber-text-light font-mono text-xs font-bold tracking-wider cursor-pointer transition-all duration-300 hover:scale-105"
              >
                VIEW PROJECTS
              </button>
            </div>

            {/* Bottom row button */}
            <div className="flex items-center justify-center w-full">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('certs');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-cyber-bg-gray/60 bg-cyber-bg-darkest/45 hover:border-cyber-bg-gray text-cyber-text-light font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105"
              >
                <Download size={13} />
                <span>DECRYPT CREDENTIALS</span>
              </a>
            </div>
          </div>

          {/* SPECIAL ACTION BUTTON: Attack Simulation Mode */}
          <div className="mt-12 w-full max-w-sm z-20">
            <button
              onClick={() => setShowSimulator(true)}
              className="w-full py-4 rounded-xl border-2 border-google-red bg-google-red/10 hover:bg-google-red/20 text-google-red font-mono text-sm font-bold tracking-widest cursor-pointer shadow-lg shadow-google-red/15 hover:shadow-google-red/25 transition-all duration-300 hover:scale-105 animate-pulse flex items-center justify-center gap-2.5"
            >
              <ShieldAlert size={18} />
              <span>SIMULATE ATTACK (MITRE)</span>
            </button>
          </div>

          {/* Scroll indicators */}
          <button
            onClick={handleScrollToJourney}
            className="mt-16 mb-6 flex flex-col items-center gap-2 font-mono text-[9px] text-cyber-text-muted hover:text-cyber-text-light transition-colors cursor-pointer"
          >
            <span>SCROLL TO BEGIN VECTOR SCAN</span>
            <ArrowDown size={14} className="animate-bounce" />
          </button>
        </section>

        {/* ================= NODE 01: ORIGIN ================= */}
        <section id="origin" className="pt-16 text-left scroll-mt-6">
          <div className="border-l-4 border-google-blue pl-4 mb-6">
            <span className="font-mono text-xs text-google-blue block uppercase tracking-widest font-bold">
              Node 01: Host Origin
            </span>
            <h2 className="font-orbitron font-extrabold text-2xl sm:text-4xl text-cyber-text-white uppercase mt-1">
              Mission Statement & Profile
            </h2>
          </div>

          <div className="glassmorphism p-6 md:p-8 rounded-xl border border-cyber-bg-gray grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 flex flex-col gap-4">
              <p className="text-sm sm:text-base text-cyber-text-light leading-relaxed font-sans font-light">
                Welcome to the security operations log of <strong className="text-cyber-text-white">Mohammad Shayaan Khan</strong>. 
                As a SOC analyst, threat engineer, and blue-teamer, I specialize in analyzing log payloads, configuring telemetry pipelines, and tracking anomalous security telemetry to defend enterprise environments.
              </p>
              <p className="text-xs sm:text-sm text-cyber-text-light leading-relaxed font-sans">
                My professional philosophy is centered around threat hunting—believing that system perimeter defense is only as strong as your internal audit logs. I design, test, and maintain Wazuh SIEM ecosystems, map adversary actions against the MITRE ATT&CK matrix, and program automated active-response scripts.
              </p>
            </div>
            
            <div className="bg-cyber-bg-darker/60 p-5 rounded-lg border border-cyber-bg-gray flex flex-col gap-3 font-mono">
              <span className="text-[10px] text-google-blue font-bold uppercase tracking-wider">
                Analyst Metadata
              </span>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between border-b border-cyber-bg-gray/40 pb-1">
                  <span className="text-cyber-text-muted">STATUS:</span>
                  <span className="text-google-green font-bold">READY_TO_DEPLOY</span>
                </div>
                <div className="flex justify-between border-b border-cyber-bg-gray/40 pb-1">
                  <span className="text-cyber-text-muted">LOCATION:</span>
                  <span className="text-cyber-text-white">India [UTC+5:30]</span>
                </div>
                <div className="flex justify-between border-b border-cyber-bg-gray/40 pb-1">
                  <span className="text-cyber-text-muted">SPECIALIZATION:</span>
                  <span className="text-cyber-text-white">Blue Team Sec</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-text-muted">AGENT_PING:</span>
                  <span className="text-google-blue">14ms (ONLINE)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= NODE 02: LEARNING CYBERSECURITY ================= */}
        <section id="learning" className="pt-16 text-left scroll-mt-6">
          <div className="border-l-4 border-google-green pl-4 mb-6">
            <span className="font-mono text-xs text-google-green block uppercase tracking-widest font-bold">
              Node 02: Learning Journey
            </span>
            <h2 className="font-orbitron font-extrabold text-2xl sm:text-4xl text-cyber-text-white uppercase mt-1">
              Education & Threat Exploration
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            <div className="glassmorphism p-6 rounded-xl border border-cyber-bg-gray flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-google-green/10 border border-google-green/40 flex items-center justify-center text-google-green font-mono text-xs font-bold">
                  01
                </div>
                <div className="flex-1 w-[2px] bg-cyber-bg-gray mt-3" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-google-green font-bold">2023 - 2024</span>
                <h4 className="text-cyber-text-white font-bold text-base mt-0.5">Foundational Log Auditing</h4>
                <p className="text-xs text-cyber-text-light leading-relaxed mt-2 font-light">
                  Began by exploring Operating System security concepts. Configured audit logs inside Linux servers, researched bash logs scripting, analyzed TCP handshakes, and audited user sessions to map basic anomalies.
                </p>
              </div>
            </div>

            <div className="glassmorphism p-6 rounded-xl border border-cyber-bg-gray flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-google-green/10 border border-google-green/40 flex items-center justify-center text-google-green font-mono text-xs font-bold">
                  02
                </div>
                <div className="flex-1 w-[2px] bg-cyber-bg-gray mt-3" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-google-green font-bold">2024 - PRESENT</span>
                <h4 className="text-cyber-text-white font-bold text-base mt-0.5">Advanced SIEM & Detection Tuning</h4>
                <p className="text-xs text-cyber-text-light leading-relaxed mt-2 font-light">
                  Pivoted to enterprise-grade tools. Structured Wazuh SIEM ecosystems, implemented custom XML decoders and OSSEC alert rules, mapped Sysmon telemetry feeds to MITRE ATT&CK stages, and built testing labs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= NODE 03: SKILLS MATRIX ================= */}
        <section id="skills" className="pt-16 text-left scroll-mt-6">
          <div className="border-l-4 border-google-yellow pl-4 mb-6">
            <span className="font-mono text-xs text-google-yellow block uppercase tracking-widest font-bold">
              Node 03: Skills Matrix
            </span>
            <h2 className="font-orbitron font-extrabold text-2xl sm:text-4xl text-cyber-text-white uppercase mt-1">
              Cyber Skills Radar
            </h2>
          </div>

          <SkillsRadar />
        </section>

        {/* ================= NODE 04: PROJECTS VAULT ================= */}
        <section id="projects" className="pt-16 text-left scroll-mt-6">
          <div className="border-l-4 border-google-red pl-4 mb-6">
            <span className="font-mono text-xs text-google-red block uppercase tracking-widest font-bold">
              Node 04: Project Directory
            </span>
            <h2 className="font-orbitron font-extrabold text-2xl sm:text-4xl text-cyber-text-white uppercase mt-1">
              Projects Command Center
            </h2>
          </div>

          <ProjectsVault />
        </section>

        {/* ================= NODE 05: SOC HOME LAB ================= */}
        <section id="soc-lab" className="pt-16 text-left scroll-mt-6">
          <div className="border-l-4 border-google-blue pl-4 mb-6">
            <span className="font-mono text-xs text-google-blue block uppercase tracking-widest font-bold">
              Node 05: Lab Environment
            </span>
            <h2 className="font-orbitron font-extrabold text-2xl sm:text-4xl text-cyber-text-white uppercase mt-1">
              SOC Home Lab & Log Flow
            </h2>
          </div>

          <LabLogFlow />
        </section>

        {/* ================= NODE 06: VULNERABILITY SCANNER ================= */}
        <section id="scanner" className="pt-16 text-left scroll-mt-6">
          <div className="border-l-4 border-google-green pl-4 mb-6">
            <span className="font-mono text-xs text-google-green block uppercase tracking-widest font-bold">
              Node 06: Security Scan
            </span>
            <h2 className="font-orbitron font-extrabold text-2xl sm:text-4xl text-cyber-text-white uppercase mt-1">
              Vulnerability Scan Terminal
            </h2>
          </div>

          <VulnerabilityScanner />
        </section>

        {/* ================= NODE 07: CERTIFICATIONS ================= */}
        <section id="certs" className="pt-16 text-left scroll-mt-6">
          <div className="border-l-4 border-google-yellow pl-4 mb-6">
            <span className="font-mono text-xs text-google-yellow block uppercase tracking-widest font-bold">
              Node 07: Credentials
            </span>
            <h2 className="font-orbitron font-extrabold text-2xl sm:text-4xl text-cyber-text-white uppercase mt-1">
              Certifications Vault
            </h2>
          </div>

          <CertificatesVault />
        </section>

        {/* ================= NODE 08: ACHIEVEMENTS ================= */}
        <section id="achievements" className="pt-16 text-left scroll-mt-6">
          <div className="border-l-4 border-google-red pl-4 mb-6">
            <span className="font-mono text-xs text-google-red block uppercase tracking-widest font-bold">
              Node 08: Accomplishments
            </span>
            <h2 className="font-orbitron font-extrabold text-2xl sm:text-4xl text-cyber-text-white uppercase mt-1">
              Achievements & Awards
            </h2>
          </div>

          {/* Achievement badge container updated for Efficient Logistics System */}
          <div className="glassmorphism p-6 sm:p-8 rounded-xl border border-cyber-bg-gray flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-google-yellow/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="w-20 h-20 rounded-full bg-google-yellow/10 border-2 border-google-yellow flex items-center justify-center text-google-yellow shadow-lg shadow-google-yellow/20 group-hover:scale-110 transition-transform duration-300 relative">
              <Award size={36} className="animate-pulse" />
              <div className="absolute inset-0 border border-dashed border-google-yellow/50 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
            </div>

            <div className="flex-1 text-left font-mono">
              <span className="text-[10px] text-google-yellow font-bold tracking-widest uppercase">
                🏆 UNIVERSITY STARTUP COMPETITION WINNER
              </span>
              <h3 className="text-cyber-text-white font-bold text-lg sm:text-xl font-sans mt-1">
                Best Startup Concept Award: Efficient Logistics System
              </h3>
              <p className="text-xs sm:text-sm text-cyber-text-light font-sans leading-relaxed mt-2.5 font-light">
                Awarded for designing and prototyping a secure, decentralized tracking system. 
                Utilized optimized packet routing algorithms and encrypted message relays to minimize logistical transit latencies while enforcing cryptographic auditing logs on all package transfers.
              </p>
              <div className="mt-4 pt-3 border-t border-cyber-bg-gray/40 flex items-center justify-between text-[9px] text-cyber-text-muted">
                <span>ISSUED: UNIVERSITY STARTUP INITIATIVE</span>
                <span>DATE: NOV 2023</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= NODE 09: FUTURE MISSION ================= */}
        <section id="mission" className="pt-16 text-left scroll-mt-6">
          <div className="border-l-4 border-google-blue pl-4 mb-6">
            <span className="font-mono text-xs text-google-blue block uppercase tracking-widest font-bold">
              Node 09: Future Missions
            </span>
            <h2 className="font-orbitron font-extrabold text-2xl sm:text-4xl text-cyber-text-white uppercase mt-1">
              Classified Dossiers
            </h2>
          </div>

          <LockedMissions />
        </section>

        {/* ================= CONTACT SECTION ================= */}
        <section id="contact" className="pt-16 text-left scroll-mt-6">
          <div className="border-l-4 border-google-blue pl-4 mb-6">
            <span className="font-mono text-xs text-google-blue block uppercase tracking-widest font-bold">
              Communication Portal
            </span>
            <h2 className="font-orbitron font-extrabold text-2xl sm:text-4xl text-cyber-text-white uppercase mt-1">
              Secure Message Gateway
            </h2>
          </div>

          <div className="glassmorphism p-6 sm:p-8 rounded-xl border border-cyber-bg-gray max-w-2xl mx-auto shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-google-blue/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2 border-b border-cyber-bg-gray pb-3 mb-6">
              <Mail size={16} className="text-google-blue animate-pulse" />
              <span className="font-mono text-[10px] text-cyber-text-white uppercase tracking-widest font-bold">
                ENCRYPTED HANDSHAKE ENVELOPE (TLS 1.3)
              </span>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-left font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-cyber-text-muted uppercase tracking-wider block mb-1">
                    Sender Identification
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={formStatus !== 'idle'}
                    className="w-full bg-cyber-bg-darkest/70 border border-cyber-bg-gray rounded px-3 py-2 text-cyber-text-white font-mono text-xs focus:outline-none focus:border-google-blue disabled:opacity-50"
                    placeholder="e.g. AGENT_RECRUITER"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-cyber-text-muted uppercase tracking-wider block mb-1">
                    Return Communication Route
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={formStatus !== 'idle'}
                    className="w-full bg-cyber-bg-darkest/70 border border-cyber-bg-gray rounded px-3 py-2 text-cyber-text-white font-mono text-xs focus:outline-none focus:border-google-blue disabled:opacity-50"
                    placeholder="e.g. hr@cyberdefense.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-cyber-text-muted uppercase tracking-wider block mb-1">
                  Telemetry Payload (Message)
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  disabled={formStatus !== 'idle'}
                  className="w-full bg-cyber-bg-darkest/70 border border-cyber-bg-gray rounded px-3 py-2 text-cyber-text-white font-mono text-xs focus:outline-none focus:border-google-blue disabled:opacity-50 resize-none"
                  placeholder="Enter message details..."
                />
              </div>

              <button
                type="submit"
                disabled={formStatus !== 'idle'}
                className="w-full py-3 rounded bg-google-blue hover:bg-google-blue/80 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formStatus === 'idle' && (
                  <>
                    <Send size={12} />
                    <span>ENCRYPT & TRANSMIT</span>
                  </>
                )}
                {formStatus === 'encrypting' && (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    <span>ENCRYPTING DATA BLOCKS...</span>
                  </>
                )}
                {formStatus === 'securing' && (
                  <>
                    <Lock size={12} className="animate-bounce" />
                    <span>VERIFYING SSL HANDSHAKE KEY...</span>
                  </>
                )}
                {formStatus === 'complete' && (
                  <>
                    <ShieldCheck size={12} className="text-google-green" />
                    <span className="text-google-green font-bold">TRANSMISSION ESTABLISHED SUCCESSFUL!</span>
                  </>
                )}
              </button>
            </form>

            {formStatus !== 'idle' && (
              <div className="mt-4 p-3 bg-cyber-bg-darker/80 rounded border border-cyber-bg-gray text-left font-mono text-[9px] leading-relaxed select-none">
                {formStatus === 'encrypting' && (
                  <div className="text-google-yellow animate-pulse">
                    <div>[+] Initializing AES-256 cipher routine...</div>
                    <div>[+] Salting payload with random bytes...</div>
                    <div>[+] Compiling packet checksum block...</div>
                  </div>
                )}
                {formStatus === 'securing' && (
                  <div className="text-google-blue">
                    <div>[+] Exchanging Diffie-Hellman public key coefficients...</div>
                    <div>[+] Creating secure TLS channel tunnel to Shayaan's inbox...</div>
                    <div>[+] Enforcing HTTPS handshake transport...</div>
                  </div>
                )}
                {formStatus === 'complete' && (
                  <div className="text-google-green">
                    <div>[+] Signature check: OK</div>
                    <div>[+] Delivery Confirmation ID: {Math.floor(Math.random() * 90000) + 10000}-SEC</div>
                    <div>[+] Security state: Closed channel. Transmission complete!</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Footer Info HUD (Aligned with container padding shift) */}
      <footer className="w-full bg-cyber-bg-darkest border-t border-cyber-bg-gray py-6 mt-auto text-center font-mono text-[10px] text-cyber-text-muted z-20 lg:pl-36 lg:pr-36 xl:pl-20 xl:pr-20 2xl:pl-0 2xl:pr-0">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 Mohammad Shayaan Khan. All rights monitored.</span>
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/in/mdshayaankhan" target="_blank" rel="noopener noreferrer" className="hover:text-google-blue transition-colors">LINKEDIN</a>
            <span>•</span>
            <a href="https://github.com/mdshayaankhan" target="_blank" rel="noopener noreferrer" className="hover:text-google-green transition-colors">GITHUB</a>
            <span>•</span>
            <span className="text-google-yellow">STATUS: GUARDED</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
