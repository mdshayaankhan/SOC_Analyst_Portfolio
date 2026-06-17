import React, { useState } from 'react';
import { Shield, Lock, Unlock, Eye, Compass, Cpu, Target } from 'lucide-react';

const missions = [
  {
    id: 'soc',
    title: 'SOC Analyst',
    status: 'ACTIVE PREPARATION',
    color: '#4285F4', // Google Blue
    focus: 'Real-time alert monitoring, incident triage, log inspection, and endpoint quarantine.',
    objectives: [
      'Refine Wazuh decoders to eliminate false-positive flags.',
      'Deploy active host isolation triggers for Linux/Windows endpoints.',
      'Conduct PCAP forensic analysis on rogue external traffic.'
    ]
  },
  {
    id: 'detection',
    title: 'Detection Engineer',
    status: 'TARGET IN QUEUE',
    color: '#FBBC05', // Google Yellow
    focus: 'Writing threat detection rules (Sigma, Yara), telemetry ingestion engineering, and MITRE mapping.',
    objectives: [
      'Convert threat intelligence feeds into actionable Wazuh rules.',
      'Configure Sysmon configurations to flag advanced registry tampering.',
      'Automate rule testing using simulated atomic red-team payloads.'
    ]
  },
  {
    id: 'hunter',
    title: 'Threat Hunter',
    status: 'LOCKED OBJECTIVE',
    color: '#EA4335', // Google Red
    focus: 'Proactive searching for indicators of compromise (IoC) and persistent advanced threat actors.',
    objectives: [
      'Establish log baselines for critical directory modifications.',
      'Analyze memory logs for potential kernel-level process injection.',
      'Map anomalous external port scans to known APT threat profiles.'
    ]
  },
  {
    id: 'blue-team',
    title: 'Blue Team Specialist',
    status: 'LOCKED OBJECTIVE',
    color: '#34A853', // Google Green
    focus: 'Holistic system defense hardening, vulnerability mitigation, and compliance enforcement.',
    objectives: [
      'Enforce strict security baselines across Windows/Linux enterprise environments.',
      'Coordinate patch audits with vulnerability scan engines.',
      'Deploy honey-tokens (decoy keys) inside filesystems to trap intruders.'
    ]
  }
];

const LockedMissions = () => {
  const [selectedMission, setSelectedMission] = useState(missions[0]);

  return (
    <div className="glassmorphism p-6 rounded-xl border border-cyber-bg-gray flex flex-col md:flex-row gap-6 w-full max-w-4xl mx-auto shadow-2xl text-left font-mono">
      
      {/* Grid of Missions Left */}
      <div className="w-full md:w-1/2 flex flex-col gap-3">
        <span className="text-[10px] text-cyber-text-muted uppercase tracking-wider block mb-1">
          Select Classified Mission File
        </span>
        
        {missions.map((mission) => {
          const isSelected = selectedMission.id === mission.id;
          const isLocked = mission.status.includes('LOCKED');
          
          return (
            <button
              key={mission.id}
              onClick={() => setSelectedMission(mission)}
              className={`w-full p-4 rounded-lg border text-left flex items-center justify-between transition-all duration-300 hover:translate-x-1 cursor-pointer ${
                isSelected 
                  ? 'bg-cyber-bg-darker' 
                  : 'bg-cyber-bg-darkest/45 border-cyber-bg-gray/50 hover:border-cyber-bg-gray'
              }`}
              style={{
                borderColor: isSelected ? mission.color : 'var(--glass-border)',
                boxShadow: isSelected ? `0 0 10px ${mission.color}15` : 'none'
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center border"
                  style={{
                    borderColor: isSelected ? mission.color : 'var(--glass-border)',
                    backgroundColor: isSelected ? `${mission.color}10` : 'transparent'
                  }}
                >
                  {isLocked && !isSelected ? (
                    <Lock size={12} className="text-cyber-text-muted" />
                  ) : (
                    <Unlock size={12} style={{ color: mission.color }} />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-cyber-text-white uppercase tracking-wider">
                    {mission.title}
                  </h4>
                  <span 
                    className="text-[8px] font-semibold"
                    style={{ color: mission.color }}
                  >
                    {mission.status}
                  </span>
                </div>
              </div>
              <Eye size={12} className={isSelected ? 'text-cyber-text-white' : 'text-cyber-text-muted'} />
            </button>
          );
        })}
      </div>

      {/* Mission details panel Right */}
      <div className="w-full md:w-1/2 flex flex-col self-stretch bg-cyber-bg-darker/40 border border-cyber-bg-gray rounded-xl p-5 relative overflow-hidden">
        {/* Abstract radar sweep overlay */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Detail Title */}
        <div className="flex items-center gap-2 border-b border-cyber-bg-gray pb-2.5 mb-4">
          <Target size={14} style={{ color: selectedMission.color }} className="animate-pulse" />
          <span className="text-[10px] text-cyber-text-white uppercase tracking-widest font-bold">
            MISSION DIRECTORY: {selectedMission.title}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <span className="text-cyber-text-muted text-[8px] block uppercase">Strategic Focus:</span>
            <p className="text-cyber-text-light text-[11px] leading-relaxed font-sans font-light mt-1">
              {selectedMission.focus}
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <span className="text-cyber-text-muted text-[8px] block uppercase">Operational Objectives:</span>
            <div className="flex flex-col gap-2 mt-1">
              {selectedMission.objectives.map((obj, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[10px] font-sans text-cyber-text-light font-light leading-relaxed">
                  <span className="font-mono text-google-blue font-bold">[{idx + 1}]</span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission footer */}
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-cyber-bg-gray/40 text-[9px]">
          <span className="w-1.5 h-1.5 rounded-full bg-google-green animate-ping" />
          <span className="text-cyber-text-muted">PREPARATION READINESS STAGE ENFORCED</span>
        </div>
      </div>

    </div>
  );
};

export default LockedMissions;
