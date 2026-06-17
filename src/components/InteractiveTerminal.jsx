import React, { useRef, useEffect } from 'react';
import { Terminal, X, ChevronRight, Minimize2, Maximize2 } from 'lucide-react';

const InteractiveTerminal = ({ isOpen, onClose }) => {
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [history, setHistory] = React.useState([
    { text: 'SYSTEM BOOT: SUCCESSFUL', type: 'system' },
    { text: 'Welcome to Shayaan\'s Cyber-Defense terminal. Type "help" for a list of available commands.', type: 'info' },
  ]);
  
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen, isMinimized]);

  if (!isOpen) return null;

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const newHistory = [...history, { text: `guest@shayaan-sec:~$ ${cmd}`, type: 'input' }];

    if (trimmedCmd === '') {
      setHistory(newHistory);
      return;
    }

    let reply = [];
    switch (trimmedCmd) {
      case 'help':
        reply = [
          { text: 'Available Commands:', type: 'info' },
          { text: '  about    - Show professional summary and roles', type: 'info' },
          { text: '  skills   - List cybersecurity & developer core skills', type: 'info' },
          { text: '  projects - Explore highlighted cyber defense projects', type: 'info' },
          { text: '  resume   - View professional certifications and resume info', type: 'info' },
          { text: '  contact  - Get secure communication details', type: 'info' },
          { text: '  clear    - Clear terminal logs', type: 'info' },
        ];
        break;
      case 'about':
        reply = [
          { text: 'MOHAMMAD SHAYAAN KHAN', type: 'success font-bold text-google-blue' },
          { text: 'Roles: SOC Analyst | Threat Hunter | Detection Engineer', type: 'info' },
          { text: 'Bio: Dedicated threat defense engineer specializing in security monitoring, Wazuh SIEM orchestration, intrusion detection, and incident response scripting. I design threat-detection playbooks and deploy end-to-end telemetry solutions to safeguard systems against modern threat vectors.', type: 'info' },
        ];
        break;
      case 'skills':
        reply = [
          { text: 'Security Operations & Telemetry:', type: 'success' },
          { text: '  SIEM (Wazuh, Splunk), Sysmon, Nmap, Wireshark, FIM, Windows/Linux telemetry', type: 'info' },
          { text: 'Threat Intelligence & Engineering:', type: 'success' },
          { text: '  MITRE ATT&CK Mapping, Attack Simulations, Rule Engineering, Threat Hunting', type: 'info' },
          { text: 'Languages & Automation:', type: 'success' },
          { text: '  Python, SQL, Bash scripting, Java, Security Automation', type: 'info' },
        ];
        break;
      case 'projects':
        reply = [
          { text: 'Featured Cyber Operations:', type: 'success' },
          { text: '1. SOC Home Lab: Wazuh SIEM + Sysmon telemetry integration + Active Response triggers.', type: 'info' },
          { text: '2. Vulnerability Scanner: Custom automated port & service scanner with CVE matching.', type: 'info' },
          { text: '3. Threat Intel Aggregator: Automated IP blacklist integration script.', type: 'info' },
          { text: '4. Active Directory defense sandbox: Centralized auditing and hardening controls.', type: 'info' },
        ];
        break;
      case 'resume':
        reply = [
          { text: 'Credentials Vault:', type: 'success' },
          { text: '  * Google Cybersecurity Professional Certificate', type: 'info' },
          { text: '  * Ethical Hacking Specialist Training', type: 'info' },
          { text: 'Awards:', type: 'success' },
          { text: '  * Best Startup Concept Award (GDSC) for Efficient Logistics System', type: 'info' },
          { text: 'Action: Scroll down to the Certifications Vault section to decrypt credentials.', type: 'info' },
        ];
        break;
      case 'contact':
        reply = [
          { text: 'SECURE COMMUNICATIONS CHANNEL:', type: 'success' },
          { text: '  * LinkedIn: linkedin.com/in/mdshayaankhan', type: 'info' },
          { text: '  * GitHub: github.com/mdshayaankhan', type: 'info' },
          { text: '  * Secure portal: Use the message portal at the bottom of the page.', type: 'info' },
        ];
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        reply = [
          { text: `Command not found: "${cmd}". Type "help" for all valid commands.`, type: 'error' },
        ];
    }

    setHistory([...newHistory, ...reply]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  const getLogColor = (type) => {
    if (type.includes('success')) return 'text-google-green';
    if (type.includes('error')) return 'text-google-red';
    if (type.includes('input')) return 'text-cyber-text-white';
    if (type.includes('system')) return 'text-google-yellow';
    return 'text-cyber-text-light';
  };

  return (
    <div className="fixed bottom-8 right-6 z-50 font-mono">
      <div
        className={`glassmorphism-blue rounded-xl flex flex-col overflow-hidden shadow-2xl border border-google-blue transition-all duration-300 ${
          isMinimized ? 'w-72 h-10' : 'w-80 sm:w-[480px] h-[340px]'
        }`}
      >
        {/* Header */}
        <div className="bg-cyber-bg-darker/90 px-3 py-2.5 border-b border-cyber-bg-gray flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-google-blue" />
            <span className="text-[10px] font-bold text-cyber-text-white tracking-widest uppercase">
              shayaan_sec_shell v1.0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-cyber-text-muted hover:text-cyber-text-white cursor-pointer"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
            </button>
            <button
              onClick={onClose}
              className="text-cyber-text-muted hover:text-google-red cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Body */}
        {!isMinimized && (
          <>
            <div className="flex-1 p-3 overflow-y-auto text-left text-[11px] leading-relaxed flex flex-col gap-1.5 bg-cyber-bg-darkest/95 scrollbar-thin">
              {history.map((log, index) => (
                <div key={index} className={getLogColor(log.type)}>
                  {log.text}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-cyber-bg-darkest/90 px-3 py-2 border-t border-cyber-bg-gray/40 flex items-center gap-1">
              <ChevronRight size={13} className="text-google-blue animate-pulse" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command (e.g. help, about)..."
                className="flex-1 bg-transparent border-none outline-none text-cyber-text-white text-[11px] font-mono placeholder-white/30"
                autoFocus
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InteractiveTerminal;
