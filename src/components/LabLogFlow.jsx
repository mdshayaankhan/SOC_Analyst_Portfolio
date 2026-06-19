import React, { useState, useEffect } from 'react';
import { Server, Monitor, Activity, ShieldCheck, Database, Send } from 'lucide-react';

const labNodes = [
  {
    id: 'ubuntu',
    label: 'Ubuntu Server',
    icon: Server,
    color: '#FBBC05', // Google Yellow
    details: 'Linux server hosting core services. Generates authentication logs, syslog stream, and filesystem auditd events.',
    telemetry: 'SSH logins, sudo access attempts, system daemon status, /etc changes.'
  },
  {
    id: 'windows',
    label: 'Windows Endpoint',
    icon: Monitor,
    color: '#4285F4', // Google Blue
    details: 'Windows client endpoint representing user workstation. Instrumented for deep kernel telemetry.',
    telemetry: 'Sysmon, Windows Event Logs (Security, System, Application).'
  },
  {
    id: 'sysmon',
    label: 'Sysmon agent',
    icon: Activity,
    color: '#FBBC05',
    details: 'System Monitor (Sysmon) background service logging system activity to Windows Event Log.',
    telemetry: 'Process creation (ID 1), File creation time (ID 2), Network connections (ID 3), Registry values (ID 12/13).'
  },
  {
    id: 'wazuh',
    label: 'Wazuh SIEM',
    icon: Database,
    color: '#EA4335', // Google Red
    details: 'Central Wazuh SIEM manager collecting logs, decoders matching log patterns, and applying security alert rules.',
    telemetry: 'Log ingestion, pattern decoding, Mitre ATT&CK indexing, agent vulnerability mapping.'
  },
  {
    id: 'alerts',
    label: 'Alert Generation',
    icon: Send,
    color: '#EA4335',
    details: 'Ingested logs trigger alert flags based on security level severity (Level 1-15).',
    telemetry: 'MITRE ATT&CK TTP mapping, Slack/Webhook integrations, Active Response triggering.'
  },
  {
    id: 'detection',
    label: 'Threat Hunting',
    icon: ShieldCheck,
    color: '#34A853', // Google Green
    details: 'Security analyst dashboard facilitating active threat hunts, indicators of compromise correlation, and incident resolution.',
    telemetry: 'FIM integrity scanning, memory dump analysis, custom Sigma rules validation.'
  }
];

const mockLogs = [
  { time: '12:15:30', source: 'Ubuntu', msg: 'sshd[12480]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 ruser= rhost=203.0.113.88', level: 'Level 5 (Guarded)' },
  { time: '12:15:32', source: 'Wazuh', msg: 'Alert Level 5 triggered: Rule 5710 (Attempted SSH login failure)', level: 'Level 5 (Guarded)' },
  { time: '12:16:01', source: 'Windows', msg: 'Sysmon Event ID 1: Process Created: C:\\Windows\\System32\\cmd.exe spawned by PowerShell.exe', level: 'Level 3 (Stable)' },
  { time: '12:16:05', source: 'Sysmon', msg: 'Event ID 3: Network Connection detected: C:\\Windows\\System32\\cmd.exe connected to 203.0.113.88:4444', level: 'Level 9 (Warning)' },
  { time: '12:16:06', source: 'Wazuh', msg: 'CRITICAL ALERT Level 12 triggered: Rule 100251 (Suspicious Shell spawning outgoing network connection)', level: 'Level 12 (Critical)' },
  { time: '12:16:08', source: 'Wazuh', msg: 'Active Response initiated: Host quarantine triggered. Windows firewall rules updating...', level: 'Level 15 (Emergency)' },
  { time: '12:16:10', source: 'Detection', msg: 'Incident Containment: Compromised Windows Endpoint isolated. Threat remediated successfully.', level: 'Level 15 (Emergency)' },
];

const LabLogFlow = () => {
  const [selectedNode, setSelectedNode] = useState(labNodes[3]);
  const [liveLogs, setLiveLogs] = useState([]);
  const [logIndex, setLogIndex] = useState(0);

  // Live log simulation feeding into terminal
  useEffect(() => {
    setLiveLogs(mockLogs.slice(0, 3));
    setLogIndex(3);

    const interval = setInterval(() => {
      setLiveLogs((prev) => {
        const nextLog = mockLogs[logIndex];
        const updated = [...prev, nextLog];
        if (updated.length > 5) updated.shift();
        return updated;
      });
      setLogIndex((prevIdx) => (prevIdx + 1) % mockLogs.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [logIndex]);

  const getLogColor = (level) => {
    if (level.includes('Critical') || level.includes('Emergency')) return 'text-google-red';
    if (level.includes('Warning')) return 'text-google-yellow';
    return 'text-google-blue';
  };

  return (
    <div className="glassmorphism p-6 rounded-xl border border-cyber-bg-gray flex flex-col gap-6 w-full max-w-4xl mx-auto shadow-2xl relative">
      
      {/* Node flowchart display */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 py-4 relative">
        {/* Connection path backdrop (desktop only) */}
        <div className="hidden lg:block absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-cyber-bg-gray z-0" />
        
        {labNodes.map((node, index) => {
          const Icon = node.icon;
          const isSelected = selectedNode.id === node.id;
          return (
            <div key={node.id} className="flex flex-col items-center z-10 w-full lg:w-auto">
              <button
                onClick={() => setSelectedNode(node)}
                className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 ${
                  isSelected 
                    ? 'bg-cyber-bg-darker scale-110' 
                    : 'bg-cyber-bg-darkest hover:bg-cyber-bg-gray'
                }`}
                style={{
                  borderColor: isSelected ? node.color : 'var(--glass-border)',
                  boxShadow: isSelected ? `0 0 16px ${node.color}` : 'none'
                }}
              >
                <Icon size={24} style={{ color: isSelected ? node.color : 'var(--cyber-text-muted)' }} />
              </button>
              <span className={`text-[10px] font-mono mt-2 text-center transition-all ${
                isSelected ? 'text-cyber-text-white font-bold' : 'text-cyber-text-muted'
              }`}>
                {node.label}
              </span>
              
              {/* Down Arrow indicator on mobile between nodes */}
              {index < labNodes.length - 1 && (
                <span className="lg:hidden text-cyber-text-muted my-2 text-xs">↓</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail HUD about Selected Node */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-b border-cyber-bg-gray py-5 text-left font-mono">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedNode.color }} />
            <h4 className="text-cyber-text-white font-bold text-sm uppercase font-sans">
              Node Details: {selectedNode.label}
            </h4>
          </div>
          <p className="text-xs text-cyber-text-light leading-relaxed font-sans font-light">
            {selectedNode.details}
          </p>
        </div>

        <div className="bg-cyber-bg-darkest/40 p-3.5 rounded border border-cyber-bg-gray">
          <span className="text-[9px] text-cyber-text-muted uppercase tracking-wider block mb-1">
            Telemetry Streamed
          </span>
          <p className="text-[11px] text-google-blue font-light">
            {selectedNode.telemetry}
          </p>
        </div>
      </div>

      {/* Live ticking event log terminal at bottom */}
      <div className="flex flex-col bg-cyber-bg-darkest/95 border border-cyber-bg-gray rounded-lg overflow-hidden font-mono">
        <div className="bg-cyber-bg-gray/30 px-4 py-2 border-b border-cyber-bg-gray flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-google-red animate-ping" />
            <span className="text-[9px] text-cyber-text-white font-bold uppercase tracking-wider">
              Telemetry SIEM Parser Log Stream
            </span>
          </div>
          <span className="text-[8px] text-cyber-text-muted uppercase">
            STATUS: PIPELINE_STABLE
          </span>
        </div>

        <div className="p-3 text-[10px] leading-relaxed text-left flex flex-col gap-1.5 min-h-[120px] max-h-[160px] overflow-y-auto select-text scrollbar-thin">
          {liveLogs.map((log, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
              <span className="text-cyber-text-muted">[{log.time}]</span>
              <span className="text-google-green font-bold">[{log.source}]</span>
              <span className="flex-1 text-cyber-text-light">{log.msg}</span>
              <span className={`text-[8px] font-bold uppercase px-1 rounded bg-cyber-bg-darker/60 border border-cyber-bg-gray/50 ${getLogColor(log.level)}`}>
                {log.level}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default LabLogFlow;
